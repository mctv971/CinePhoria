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

    .dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-content {
        display: none;
        position: absolute;
        background-color: #f9f9f9;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        padding: 12px 16px;
        z-index: 1;
    }

    .dropdown:hover .dropdown-content {
        display: block;
    }

    .dropdown-content select {
        width: 100%;
        padding: 8px;
        margin-top: 8px;
        margin-bottom: 8px;
        box-sizing: border-box;
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
        <button id="votesButton" data-attribute="votes">Votes</button>
        <div class="dropdown">
            <button id="revenueComparisonButton" data-attribute="revenue">Revenus par Régions</button>
            <div class="dropdown-content">
                <select id="revenueDropdown">
                    <option value="<?php echo $_SESSION['selectedMovieId'] ?>">Film 1</option>
                    <option value="<?php echo $_SESSION['selectedMovieId2'] ?>">Film 2</option>
                </select>
            </div>
        </div>
        <div class="dropdown">
    <button id="castComparisonButton" data-attribute="cast">Top Cast</button>
    <div class="dropdown-content">
        <select id="castDropdown">
            <option value="<?php echo $_SESSION['selectedMovieId'] ?>">Film 1</option>
            <option value="<?php echo $_SESSION['selectedMovieId2'] ?>">Film 2</option>
        </select>
    </div>
</div>
       
    </div>

    <div style="width: 80%; height: 100%; margin: auto; text-align: center">
        <canvas id="combinedChart" width="400" height="200"></canvas>
    </div>

    <script>
        $(document).ready(function () {
            // Créer une instance de Chart
            var combinedChart = null;

            $('.button-container button').on('click', function () {
                var selectedAttribute = $(this).data('attribute');

                var selectedMovieId = '<?php echo $_SESSION['selectedMovieId'] ?>';
                var selectedMovieId2 = '<?php echo $_SESSION['selectedMovieId2'] ?>';

                // Supprimer le graphique existant s'il y en a un
                destroyChart();

                // Créer le graphique en fonction de l'attribut sélectionné
                if (selectedAttribute === 'votes') {
                    getCombinedVotesDetails(selectedMovieId, selectedMovieId2);
                } else if (selectedAttribute === 'revenue') {
                    var selectedRevenueMovieId = $('#revenueDropdown').val();
                getRevenueData(selectedRevenueMovieId);
                } else if (selectedAttribute === 'cast') {
                    var selectedTopCastMovieId = $('#castDropdown').val();
                getTopCastIDs(selectedTopCastMovieId, function (error, topCastIds) {
                    if (error) {
                        console.error('Erreur lors de la récupération des IDs du Top Cast:', error);
                    } else {
                        // Appeler la fonction pour obtenir les données de popularité pour chaque collaborateur et créer le graphique
                        getPopularityDataForTopCast(topCastIds);
                    }
                });
                } else {
                    getMovieDetails(selectedMovieId, selectedMovieId2, selectedAttribute);
                }
            });

            $('#castDropdown').on('change', function () {
            var selectedMovieId = $(this).val();

            // Supprimer le graphique existant s'il y en a un
            destroyChart();

            // Afficher le graphique pour le film sélectionné
            getTopCastIDs(selectedMovieId, function (error, topCastIds) {
                if (error) {
                    console.error('Erreur lors de la récupération des IDs du Top Cast:', error);
                } else {
                    // Appeler la fonction pour obtenir les données de popularité pour chaque collaborateur et créer le graphique
                    getPopularityDataForTopCast(topCastIds);
                }
            });
        });

            // Gérer le changement de film avec le bouton "Switch Movie"
            $('#switchMovieButton').on('click', function () {
                // Basculer entre le premier et le deuxième film
                const currentMovieId = $('#movieSelection').val();
                const newMovieId = currentMovieId === '<?php echo $_SESSION['selectedMovieId'] ?>'
                    ? '<?php echo $_SESSION['selectedMovieId2'] ?>'
                    : '<?php echo $_SESSION['selectedMovieId'] ?>';

                // Mettre à jour le menu déroulant
                $('#movieSelection').val(newMovieId);

                // Supprimer le graphique existant s'il y en a un
                destroyChart();

                // Afficher le graphique pour le nouveau film
                getRevenueData(newMovieId);
            });
            

            // Gérer le changement de film dans la liste déroulante pour les revenus par région
            $('#revenueDropdown').on('change', function () {
                var selectedMovieId = $(this).val();

                // Supprimer le graphique existant s'il y en a un
                destroyChart();

                // Afficher le graphique pour le film sélectionné
                getRevenueData(selectedMovieId);
            });
            $('#castcDropdown').on('change', function () {
                var selectedMovieId = $(this).val();

                // Supprimer le graphique existant s'il y en a un
                destroyChart();

                // Afficher le graphique pour le film sélectionné
                getRevenueData(selectedMovieId);
            });

            var chartInstances = [];

            function destroyChart() {
    // Détruire toutes les instances de graphiques
    chartInstances.forEach(function (chart) {
        chart.destroy();
    });
    // Effacer le tableau d'instances
    chartInstances = [];
}

            function getRevenueData(movieId) {
                // Appeler votre API ou votre fonction pour obtenir les données de revenus par régions
                // Utilisez ces données pour créer le graphique des revenus par régions (pie chart)
                // Assurez-vous d'utiliser la bibliothèque Chart.js pour créer le graphique
                const settings = {
                    async: true,
                    crossDomain: true,
                    url: 'https://imdb8.p.rapidapi.com/title/v2/get-business?tconst=' + movieId,
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': '8cc2cf9290mshe7b85af954aa563p182979jsnfe362503c6de',
                        'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
                    }
                };

                $.ajax(settings).done(function (response) {
                    try {
                        console.log('Raw Response:', response); // Ajout d'un message de débogage

                        // Vérifier si la réponse contient les données attendues
                        if (response && response.titleBoxOffice && response.titleBoxOffice.gross && response.titleBoxOffice.gross.regional) {
                            const revenueData = response.titleBoxOffice.gross.regional;
                            const movieName = response.title;

                            // Utiliser la fonction spécifique pour créer le graphique de revenus par régions
                            createRevenuePieChart(revenueData, movieName);
                        } else {
                            console.error('Invalid or incomplete response structure.');
                        }
                    } catch (error) {
                        console.error('Failed to process revenue data.', error);
                    }
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    console.error('Failed to fetch revenue data for the movie.');
                    console.error('Status:', textStatus);
                    console.error('Error:', errorThrown);
                });
            }

            function createCombinedChart(data1, movieName1, data2, movieName2, categories) {
                const ctx = document.getElementById('combinedChart').getContext('2d');
                const newChart = new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: categories,
                        datasets: [{
                                label: movieName1,
                                data: data1[0],
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1
                            },
                            {
                                label: movieName2,
                                data: data2[0],
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                borderColor: 'rgba(255, 99, 132, 1)',
                                borderWidth: 1
                            }
                        ]
                    },
                    options: {
                        scale: {
                            ticks: {
                                beginAtZero: true,
                                max: 250000
                            }
                        }
                    }
                });
                chartInstances.push(newChart);
            }

            function createRevenuePieChart(data, movieName) {
                // Récupérer le contexte du canvas
                const ctx = document.getElementById('combinedChart').getContext('2d');

                // Créer le nouveau graphique
                const newChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: data.map(region => region.regionName),
                        datasets: [{
                            label: movieName,
                            data: data.map(region => region.total.amount),
                            backgroundColor: getRandomColorArray(data.length),
                            borderColor: 'rgba(255, 255, 255, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
                chartInstances.push(newChart);
            }

            // Fonction pour générer un tableau de couleurs aléatoires
            function getRandomColorArray(length) {
                const colorArray = [];
                for (let i = 0; i < length; i++) {
                    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
                    colorArray.push(randomColor);
                }
                return colorArray;
            }

            function getTopCastIDs(titleId, callback) {
                const settings = {
                    async: true,
                    crossDomain: true,
                    url: 'https://imdb8.p.rapidapi.com/title/get-top-cast?tconst=' + titleId,
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': '8cc2cf9290mshe7b85af954aa563p182979jsnfe362503c6de',
                        'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
                    }
                };

                $.ajax(settings).done(function (response) {
                    try {
                        // Extraire les 5 premiers ID en retirant le dernier caractère et les 6 premiers
                        const extractedIDs = response.slice(0, 5).map(id => id.slice(0, -1).substring(6));
                        callback(null, extractedIDs);
                    } catch (error) {
                        callback(error, null);
                    }
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    callback({
                        status: textStatus,
                        error: errorThrown
                    }, null);
                });
            }

            function getCombinedVotesDetails(selectedMovieId, selectedMovieId2) {
                const settings = {
                    async: true,
                    crossDomain: true,
                    url: 'https://imdb8.p.rapidapi.com/title/get-ratings?tconst=' + selectedMovieId,
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': '8cc2cf9290mshe7b85af954aa563p182979jsnfe362503c6de',
                        'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
                    }
                };

                const settings2 = {
                    async: true,
                    crossDomain: true,
                    url: 'https://imdb8.p.rapidapi.com/title/get-ratings?tconst=' + selectedMovieId2,
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': '8cc2cf9290mshe7b85af954aa563p182979jsnfe362503c6de',
                        'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
                    }
                };

                $.when(
                    $.ajax(settings),
                    $.ajax(settings2)
                ).done(function (response1, response2) {
                    const movieName1 = response1[0].title;
                    const categories = Object.keys(response1[0].ratingsHistograms['IMDb Users'].histogram);
                    const data1 = [
                        Object.values(response1[0].ratingsHistograms['IMDb Users'].histogram),
                    ];

                    const movieName2 = response2[0].title;
                    const data2 = [
                        Object.values(response2[0].ratingsHistograms['IMDb Users'].histogram),
                    ];

                    createCombinedChart(data1, movieName1, data2, movieName2, categories);
                }).fail(function () {
                    console.error('Failed to fetch data for one or both movies.');
                });
            }

            // Ajoutez cette fonction pour traiter la récupération de données de popularité
            function getPopularityData(id) {
                const options = {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjVlNWQ5OTUxYTdiNzg0ZTZkMDBjZjk3OGU4YjcyYyIsInN1YiI6IjY1Mzc3YzIxYzUwYWQyMDEyZGY0YjI2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jMOywP2uIuyrtnbX0kYWNkbGf0wTMUnNmKsFrNhcVXU'
                    }
                };

                return fetch('https://api.themoviedb.org/3/find/' + id + '?external_source=imdb_id', options)
                    .then(response => response.json())
                    .then(response => response.person_results[0].popularity)
                    .catch(err => Promise.reject(err));
            }

            function getPopularityDataForTopCast(topCastIds) {
                const popularityData = [];

                // Utiliser la fonction asynchrone pour traiter chaque ID du Top Cast
                (async function loop() {
                    for (const id of topCastIds) {
                        try {
                            // Utiliser l'API pour obtenir les données de popularité pour chaque collaborateur
                            const popularity = await getPopularityData(id);
                            popularityData.push({
                                name: id,
                                popularity: popularity
                            });
                        } catch (error) {
                            console.error('Failed to fetch popularity data for ID:', id);
                        }
                    }

                    // Créer le graphique à barres avec les données de popularité
                    createPopularityBarChart(popularityData);
                })();
            }

            // Fonction pour créer le graphique à barres
            function createPopularityBarChart(data) {
                const names = data.map(item => item.name);
                const scores = data.map(item => item.popularity);

                const ctx = document.getElementById('combinedChart').getContext('2d');
                const newChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: names,
                        datasets: [{
                            label: 'Popularité',
                            data: scores,
                            backgroundColor: getRandomColorArray(data.length),
                            borderColor: 'rgba(255, 255, 255, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
                chartInstances.push(newChart);
            }
        });
    </script>
</body>
</html>
