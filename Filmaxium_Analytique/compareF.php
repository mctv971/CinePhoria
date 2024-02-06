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

    :root {
        --button-background: dodgerblue;
        --button-color: white;
        --button-hover: #4682b4;
        --button-border-radius: 8px;
        --button-margin: 5px;
    }

    body {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100%;
        background-color: #222229;
    }

    .button-container {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    .button-container button {
        background: var(--button-background);
        color: var(--button-color);
        border: none;
        padding: 10px 20px;
        border-radius: var(--button-border-radius);
        cursor: pointer;
        margin: var(--button-margin);
        transition: background 0.3s ease;
    }

    .button-container button:hover {
        background-color: var(--button-hover);
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
<br>
<br>

<div class="button-container">
    <button id="budgetButton" data-attribute="budget">Budget</button>
    <button id="ratingsButton" data-attribute="ratings">Popularité</button>
    <button id="awardsButton" data-attribute="awards">Récompenses</button>
</div>


<div style="width: 80%;height: 100%; margin: auto; text-align: center">
    <canvas id="budgetChart" width="400" height="200"></canvas>
    <canvas id="ratingsChart" width="400" height="200"></canvas>
    <canvas id="awardsChart" width="400" height="200"></canvas>
</div>


<script>
    $(document).ready(function () {
    $('.button-container button').on('click', function () {
        var selectedAttribute = $(this).data('attribute');

        $('#budgetChart').hide();
        $('#ratingsChart').hide();
        $('#awardsChart').hide();
        $(`#${selectedAttribute}Chart`).show();

        var selectedMovieId = null;
        var selectedMovieId2 = null;

        // Ajoutez une condition pour récupérer les identifiants en fonction du bouton cliqué
        if (selectedAttribute === 'budget') {
            selectedMovieId = '<?php echo $_SESSION['selectedMovieId'] ?>';
            selectedMovieId2 = '<?php echo $_SESSION['selectedMovieId2'] ?>';
        } else if (selectedAttribute === 'ratings') {
            // Récupérer les identifiants pour Ratings
            selectedMovieId = '<?php echo $_SESSION['selectedMovieId'] ?>';
            selectedMovieId2 = '<?php echo $_SESSION['selectedMovieId2'] ?>';
        } else if (selectedAttribute === 'awards') {
            // Récupérer les identifiants pour Awards
            selectedMovieId = '<?php echo $_SESSION['selectedMovieId'] ?>';
            selectedMovieId2 = '<?php echo $_SESSION['selectedMovieId2'] ?>';
        }

        getMovieDetails(selectedMovieId, selectedMovieId2, selectedAttribute);
    });
});

    function getMovieDetails(selectedMovieId, selectedMovieId2, attribute) {
        var apiKey = '19daa2c0';
        var apiUrl = `http://www.omdbapi.com/?i=${selectedMovieId}&apikey=${apiKey}`;

        $.ajax({
            url: apiUrl,
            type: 'GET',
            dataType: 'json',
            success: function (response1) {
                var data1;

                if (attribute === 'budget' && response1.BoxOffice) {
                    data1 = parseInt(response1.BoxOffice.replace(/\D/g, ''));
                } else if (attribute === 'ratings' && response1.Ratings && response1.Ratings.length > 0) {
                    data1 = parseFloat(response1.Ratings[0].Value);
                } else if (attribute === 'awards' && response1.Awards) {
                    var awardsArray = response1.Awards.match(/\d+/g);
                    var sum = awardsArray ? awardsArray.reduce((a, b) => parseInt(a) + parseInt(b), 0) : 0;
                    data1 = sum;
                } else {
                    // Si l'information n'est pas disponible, attribuer une valeur nulle
                    data1 = null;
                }

                const movie1Name = response1.Title;

                var apiUrl2 = `http://www.omdbapi.com/?i=${selectedMovieId2}&apikey=${apiKey}`;
                $.ajax({
                    url: apiUrl2,
                    type: 'GET',
                    dataType: 'json',
                    success: function (response2) {
                        var data2;

                        if (attribute === 'budget' && response2.BoxOffice) {
                            data2 = parseInt(response2.BoxOffice.replace(/\D/g, ''));
                        } else if (attribute === 'ratings' && response2.Ratings && response2.Ratings.length > 0) {
                            data2 = parseFloat(response2.Ratings[0].Value);
                        } else if (attribute === 'awards' && response2.Awards) {
                            var awardsArray2 = response2.Awards.match(/\d+/g);
                            var sum2 = awardsArray2 ? awardsArray2.reduce((a, b) => parseInt(a) + parseInt(b), 0) : 0;
                            data2 = sum2;
                        } else {
                            // Si l'information n'est pas disponible, attribuer une valeur nulle
                            data2 = null;
                        }

                        const movie2Name = response2.Title;

                        createChart(attribute, [data1, data2], movie1Name, movie2Name);
                    },
                    error: function (xhr2, status2, error2) {
                        console.error('Erreur lors de la récupération des détails du deuxième film.');
                        console.log('Status:', status2);
                        console.log('Error:', error2);
                    }
                });
            },
            error: function (xhr1, status1, error1) {
                console.error('Erreur lors de la récupération des détails du premier film.');
                console.log('Status:', status1);
                console.log('Error:', error1);
            }
        });
    }

    function createChart(attribute, data, movie1Name, movie2Name) {
        const ctx = document.getElementById(`${attribute}Chart`).getContext('2d');
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [movie1Name, movie2Name],
                datasets: [{
                    label: attribute,
                    data: data,
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        if (attribute !== 'budget') {
            $('#budgetChart').hide();
        }
        if (attribute !== 'ratings') {
            $('#ratingsChart').hide();
        }
        if (attribute !== 'awards') {
            $('#awardsChart').hide();
        }
    }

</script>


</body>
</html>
