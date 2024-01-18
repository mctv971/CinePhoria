<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comparaison de films</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
</head>
<style>
    body {
        margin: auto;
        display: flex;
        flex-direction: column;
        background: linear-gradient(to bottom, #E4CD83, #FFFFFF) no-repeat;
        height: 100vh;
        border-radius: 25px;
    }

    /* Tweak to change the look and feel */
    :root {
        --button-background: dodgerblue;
        --button-color: white;
        --dropdown-highlight: dodgerblue;
        --dropdown-width: 160px;
        --dropdown-background: white;
        --dropdown-color: black;
    }

    /* Center the planet */
    body {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: #222229;
    }

    /* Boring button styles */
    a.button {
        /* Frame */
        display: inline-block;
        padding: 20px 28px;
        border-radius: 50px;
        box-sizing: border-box;
        /* Style */
        border: none;
        background: var(--button-background);
        color: var(--button-color);
        font-size: 24px;
        cursor: pointer;
    }

    a.button:active {
        filter: brightness(75%);
    }

    /* Dropdown styles */
    .dropdown {
        position: relative;
        padding: 0;
        margin-right: 1em;
        border: none;
    }

    .dropdown summary {
        list-style: none;
        list-style-type: none;
    }

    .dropdown > summary::-webkit-details-marker {
        display: none;
    }

    .dropdown summary:focus {
        outline: none;
    }

    .dropdown summary:focus a.button {
        border: 2px solid white;
    }

    .dropdown summary:focus {
        outline: none;
    }

    .dropdown ul {
        position: absolute;
        margin: 20px 0 0 0;
        padding: 20px 0;
        width: var(--dropdown-width);
        left: 50%;
        margin-left: calc((var(--dropdown-width) / 2) * -1);
        box-sizing: border-box;
        z-index: 2;
        background: var(--dropdown-background);
        border-radius: 6px;
        list-style: none;
    }

    .dropdown ul li {
        padding: 0;
        margin: 0;
    }

    .dropdown ul li a:link,
    .dropdown ul li a:visited {
        display: inline-block;
        padding: 10px 0.8rem;
        width: 100%;
        box-sizing: border-box;
        color: var(--dropdown-color);
        text-decoration: none;
    }

    .dropdown ul li a:hover {
        background-color: var(--dropdown-highlight);
        color: var(--dropdown-background);
    }

    /* Dropdown triangle */
    .dropdown ul::before {
        content: ' ';
        position: absolute;
        width: 0;
        height: 0;
        top: -10px;
        left: 50%;
        margin-left: -10px;
        border-style: solid;
        border-width: 0 10px 10px 10px;
        border-color: transparent transparent var(--dropdown-background) transparent;
    }

    /* Close the dropdown with outside clicks */
    .dropdown > summary::before {
        display: none;
    }

    .dropdown[open] > summary::before {
        content: ' ';
        display: block;
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 1;
    }
</style>
<body>
<?php
session_start();
?>
<details class="dropdown">
    <summary role="button">
        <a id="attributeButton" class="button">Attribut !</a>
    </summary>
    <ul>
        <li><a href="#" data-attribute="budget">Budget</a></li>
        <li><a href="#" data-attribute="ratings">Popularité</a></li>
        <li><a href="#" data-attribute="awards">Récompenses</a></li>
    </ul>
</details>

<!-- Bouton pour créer le graphique -->
<button id="createChartButton" class="button">Comparons!</button>

<div style="width: 80%; margin: auto; text-align: center">
    <canvas id="ratingChart" width="400" height="200"></canvas>
    <canvas id="votesChart" width="400" height="200"></canvas>
</div>

<script>
var selectedAttribute = "budget"; // Par défaut, comparer le budget
var votesChart; // Ajout d'une variable pour le graphique des votes

// Détecter le changement dans le dropdown
$(".dropdown ul li a").on("click", function () {
    var newAttribute = $(this).attr("data-attribute");

    // Vérifier si l'attribut a changé
    if (newAttribute !== selectedAttribute) {
        // Mettre à jour l'attribut sélectionné
        selectedAttribute = newAttribute;

        // Mettre à jour le texte du bouton avec le nom de l'attribut sélectionné
        $("#attributeButton").text($(this).text());

        // Gérer l'affichage du graphique des votes en fonction de l'attribut sélectionné
        if (selectedAttribute === "ratings") {
            $("#votesChart").show(); // Afficher le conteneur du graphique des votes
        } else {
            // Si l'attribut sélectionné n'est pas "ratings", cacher le graphique des votes
            if (votesChart) {
                votesChart.destroy();
                $("#votesChart").hide();
            }
        }
    }
});

$("#createChartButton").on("click", function () {
    // Récupérer les valeurs de session
    var selectedMovieId = <?php echo json_encode($_SESSION['selectedMovieId']); ?>;
    var selectedMovieId2 = <?php echo json_encode($_SESSION['selectedMovieId2']); ?>;

    // Vérifier si les valeurs de session sont définies
    if (!selectedMovieId || !selectedMovieId2) {
        alert("Erreur: Les identifiants de film ne sont pas définis.");
        return;
    }

    console.log(selectedMovieId);
    console.log(selectedMovieId2);

    fetchData(selectedMovieId, function (data1) {
        fetchData(selectedMovieId2, function (data2) {
            // Supprimer les graphiques existants
            if (window.myChart) {
                window.myChart.destroy();
            }

            var ctxRating = document.getElementById('ratingChart').getContext('2d');
            var ctxVotes = document.getElementById('votesChart').getContext('2d');

            // Créer les graphiques en fonction de l'attribut sélectionné
            if (selectedAttribute === "budget") {
                var budget1 = data1.titleBoxOffice.budget.amount;
                var budget2 = data2.titleBoxOffice.budget.amount;

                var gross1 = data1.titleBoxOffice.gross.aggregations.find(item => item.area === "XWW").total.amount;
                var gross2 = data2.titleBoxOffice.gross.aggregations.find(item => item.area === "XWW").total.amount;

                window.myChart = new Chart(ctxRating, {
                    type: 'bar',
                    data: {
                        labels: ['Film 1', 'Film 2'],
                        datasets: [
                            {
                                label: 'Budget',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                                data: [budget1, budget2]
                            },
                            {
                                label: 'Gross',
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                borderColor: 'rgba(255, 99, 132, 1)',
                                borderWidth: 1,
                                data: [gross1, gross2]
                            }
                        ]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            } else if (selectedAttribute === "ratings") {
                var rating1 = data1.rating;
                var rating2 = data2.rating;

                window.myChart = new Chart(ctxRating, {
                    type: 'bar',
                    data: {
                        labels: ['Film 1', 'Film 2'],
                        datasets: [
                            {
                                label: 'Note',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                                data: [rating1, rating2]
                            }
                        ]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });

                var votes1 = data1.ratingCount;
                var votes2 = data2.ratingCount;

                // Créer le graphique des votes
                votesChart = new Chart(ctxVotes, {
                    type: 'bar',
                    data: {
                        labels: ['Film 1', 'Film 2'],
                        datasets: [
                            {
                                label: 'Nombre de Votes',
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                borderColor: 'rgba(255, 99, 132, 1)',
                                borderWidth: 1,
                                data: [votes1, votes2]
                            }
                        ]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });

                $("#votesChart").show();
            } else if (selectedAttribute === "awards") {
                var highlighted1 = data1.awardsSummary.highlighted;
                var otherNominationsCount1 = data1.awardsSummary.otherNominationsCount;
                var otherWinsCount1 = data1.awardsSummary.otherWinsCount;

                var highlighted2 = data2.awardsSummary.highlighted;
                var otherNominationsCount2 = data2.awardsSummary.otherNominationsCount;
                var otherWinsCount2 = data2.awardsSummary.otherWinsCount;

                window.myChart = new Chart(ctxRating, {
                    type: 'bar',
                    data: {
                        labels: ['Film 1', 'Film 2'],
                        datasets: [
                            {
                                label: 'Wins',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                                data: [highlighted1.isWinner ? 1 : 0, highlighted2.isWinner ? 1 : 0]
                            },
                            {
                                label: 'Nominations',
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                borderColor: 'rgba(255, 99, 132, 1)',
                                borderWidth: 1,
                                data: [otherWinsCount1, otherWinsCount2]
                            }
                        ]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
        });
    });
});

function fetchData(movieId, callback) {
    var attributeUrl;

    // Choisir l'URL en fonction de l'attribut sélectionné
    if (selectedAttribute === "budget") {
        attributeUrl = "https://imdb8.p.rapidapi.com/title/v2/get-business?tconst=";
    } else if (selectedAttribute === "ratings") {
        attributeUrl = "https://imdb8.p.rapidapi.com/title/get-ratings?tconst=";
    } else if (selectedAttribute === "awards") {
        attributeUrl = "https://imdb8.p.rapidapi.com/title/get-awards-summary?tconst=";
    }

    // Assurez-vous que l'URL est correctement formée
    var apiUrl = attributeUrl + movieId;
    console.log(apiUrl); // Ajoutez cette ligne pour déboguer

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": apiUrl,
        "method": "GET",
        "headers": {
            "X-RapidAPI-Key": "4af10acecamsh208e06566c5c57dp183d71jsnd3b78c58d16e",
            "X-RapidAPI-Host": "imdb8.p.rapidapi.com"
        }
    };

    $.ajax(settings).done(function (response) {
        callback(response);
    });
}

</script>

</body>
</html>
