<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="filmaxium.css">
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Encode+Sans:wght@400;700&display=swap">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <title>Analyse - Fiche stats</title>
    <style>
        body {
            background: linear-gradient(to bottom, #00113E, #697CA4) no-repeat;
            margin: 0;
            font-family: 'Encode Sans', sans-serif;
            height: 100%;
        }

        #movie-container {
            display: flex;
            padding: 20px;
            max-width: 1200px;
            margin: 20px auto;
            color: white;
            text-align: center;
            text-shadow: 2px 0 0 black, 2px 2px 0 black, 0 2px 0 black, -2px 2px 0 black, -2px 0 0 black, -2px -2px 0 black, 0 -2px 0 black, 2px -2px 0 black;
        }

        #movie-container img {
            max-width: 200px;
            height: auto;
            border-radius: 10px;
            margin-right: 20px;
        }

        .chart-container {
            max-width: 600px;
            margin-top: 20px;
            background-color: rgba(255, 255, 255, 0.8);
            padding: 20px;
            border-radius: 10px;
            margin: auto;
        }

        canvas {
            border-radius: 10px; /* Coins arrondis pour le graphique */
        }

        .chart-dropdown {
            text-align: center;
            margin-top: 20px;
        }

        .chart-dropdown select {
            padding: 10px;
            font-size: 16px;
        }
    </style>
</head>

<body>

    <header>
        <div>
            <a id="logo" href="analytique_accueil.php"><img src="img/logo.png" alt="Logo"></a>
        </div>
        <nav class="nav-links">
            <a href="analyse.php">Analyse</a>
            <a href="prediction.php">Prediction</a>
            <a href="stats.php">Stats</a>
        </nav>
        <div class="nav-buttons">
            <a href="#"><img src="img/films.png" alt="Films btn"></a>
            <div class="dropdown">
                <a href="#"><img src="img/profile.png" alt="Profile btn"></a>
                <div class="dropdown-content">
                    <a href="#">Mon profil</a>
                    <a href="#">Paramètres</a>
                    <a href="#">Déconnexion</a>
                </div>
            </div>
        </div>
    </header>

    <?php
    $movieId = isset($_GET['id']) ? $_GET['id'] : null;
    ?>

    <div id="movie-container"></div>

    <div class="chart-container">
        <div class="chart-dropdown">
            <label for="chartType">Choisir le type de graphique : </label>
            <select id="chartType" onchange="updateChartType()">
                <option value="revenue" selected>Revenu</option>
                <option value="popularity">Popularité</option>
                <option value="awards">Résumé des Awards</option>
            </select>
        </div>
        <canvas id="statsChart"></canvas>
    </div>

    <br>

    <button id="scrollToTopBtn" onclick="scrollToTop()">Vers le haut</button>

    <script>
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        const movieContainer = document.getElementById('movie-container');
        let statsChart;

        var selectedMovieId = "<?php echo $movieId; ?>";
        var apiKey = '19daa2c0';
        var apiUrl = `http://www.omdbapi.com/?i=${selectedMovieId}&apikey=${apiKey}&plot=full`;

        // Ajout d'une condition pour vérifier le type de graphique choisi
        var defaultChartType = 'revenue';
        if (defaultChartType === 'revenue' || defaultChartType === 'popularity' || defaultChartType === 'awards') {
            fetch(apiUrl)
                .then(response => response.json())
                .then(movieData => {
                    const movieHTML = `
                        <img src="${movieData.Poster}" alt="${movieData.Title}">
                        <div class="synopsis">
                            <h2>${movieData.Title}</h2>
                            <p>${movieData.Plot}</p>
                            <p>Date de sortie: ${movieData.Released}</p>
                            <p>Genres: ${movieData.Genre}</p>
                        </div>
                    `;

                    movieContainer.innerHTML = movieHTML;

                    const statsData = {
                        revenue: parseInt(movieData.BoxOffice.replace(/\$/g, '').replace(/,/g, '')),
                        popularity: parseFloat(movieData.imdbRating) * 10,
                        awardsWins: parseInt(movieData.Awards.match(/\d+ win/)?.[0]) || 0,
                        awardsNominations: parseInt(movieData.Awards.match(/\d+ nomination/)?.[0]) || 0,
                    };

                    const statsChartCtx = document.getElementById('statsChart').getContext('2d');
                    statsChart = new Chart(statsChartCtx, {
                        type: 'bar',
                        data: {
                            labels: Object.keys(statsData),
                            datasets: [{
                                label: 'Valeurs',
                                data: Object.values(statsData),
                                backgroundColor: [
                                    'rgba(54, 162, 235, 0.7)',
                                ],
                                borderWidth: 1,
                            }],
                        },
                    });

                    // Ajout de la ligne suivante pour simuler le clic sur le bouton Revenu par défaut
                    updateChartType();
                })
                .catch(error => {
                    console.error(error);
                });
        }

        function updateChartType() {
            const chartType = document.getElementById('chartType').value;
            const chartContainer = document.querySelector('.chart-container');

            if (chartType === 'revenue') {
                fetch(apiUrl)
                    .then(response => response.json())
                    .then(movieData => {
                        const statsData = {
                            revenue: parseInt(movieData.BoxOffice.replace(/\$/g, '').replace(/,/g, '')),
                        };

                        chartContainer.style.display = 'block';

                        statsChart.destroy();
                        const statsChartCtx = document.getElementById('statsChart').getContext('2d');
                        statsChart = new Chart(statsChartCtx, {
                            type: 'bar',
                            data: {
                                labels: ['Revenu'],
                                datasets: [{
                                    label: 'Revenu',
                                    data: [statsData.revenue],
                                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                                    borderWidth: 1,
                                }],
                            },
                        });
                    })
                    .catch(error => {
                        console.error(error);
                    });
            } else if (chartType === 'popularity') {
                fetch(apiUrl)
                    .then(response => response.json())
                    .then(movieData => {
                        const statsData = {
                            popularity: parseFloat(movieData.imdbRating) * 10,
                        };

                        chartContainer.style.display = 'block';

                        statsChart.destroy();
                        const statsChartCtx = document.getElementById('statsChart').getContext('2d');
                        statsChart = new Chart(statsChartCtx, {
                            type: 'bar',
                            data: {
                                labels: ['Popularité'],
                                datasets: [{
                                    label: 'Popularité',
                                    data: [statsData.popularity],
                                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                                    borderWidth: 1,
                                }],
                            },
                        });
                    })
                    .catch(error => {
                        console.error(error);
                    });
            } else if (chartType === 'awards') {
                fetch(apiUrl)
                    .then(response => response.json())
                    .then(movieData => {
                        const awardsData = {
                            wins: parseInt(movieData.Awards.match(/\d+ win/)?.[0]) || 0,
                            nominations: parseInt(movieData.Awards.match(/\d+ nomination/)?.[0]) || 0,
                        };

                        chartContainer.style.display = 'block';

                        statsChart.destroy();
                        const statsChartCtx = document.getElementById('statsChart').getContext('2d');
                        statsChart = new Chart(statsChartCtx, {
                            type: 'bar',
                            data: {
                                labels: Object.keys(awardsData),
                                datasets: [{
                                    label: 'Résumé des Awards',
                                    data: Object.values(awardsData),
                                    backgroundColor: 'rgba(255, 206, 86, 0.7)',
                                    borderWidth: 1,
                                }],
                            },
                        });
                    })
                    .catch(error => {
                        console.error(error);
                    });
            } else if (chartType === 'default') {
                chartContainer.style.display = 'none';
                statsChart.destroy(); // Assurez-vous de détruire le graphique actuel s'il y en a un.
            }
        }
    </script>

</body>

</html>
