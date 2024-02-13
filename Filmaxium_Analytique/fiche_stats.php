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
            background-color:rgba(255, 255, 255, 0.8);
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
<?php
session_start()
?>
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
                <option value="popularity">Popularité</option>
                <option value="revenue">Revenu</option>
                <option value="gross" selected>Revenu par région </option>
            </select>
        </div>
        <canvas id="statsChart"></canvas>
    </div>

    <button id="scrollToTopBtn" onclick="scrollToTop()">Vers le haut</button>

    <script>
       function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

let selectedChartType = 'gross'; // par défaut, le type de graphique sélectionné est 'gross'

const movieContainer = document.getElementById('movie-container');
let statsChart;
let imdb_id;

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjVlNWQ5OTUxYTdiNzg0ZTZkMDBjZjk3OGU4YjcyYyIsInN1YiI6IjY1Mzc3YzIxYzUwYWQyMDEyZGY0YjI2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jMOywP2uIuyrtnbX0kYWNkbGf0wTMUnNmKsFrNhcVXU'
    }
};

fetch('https://api.themoviedb.org/3/movie/' + <?php echo $movieId; ?> + '?language=fr-FR', options)
    .then(response => response.json())
    .then(movieData => {
        const movieHTML = `
            <img src="https://image.tmdb.org/t/p/w500/${movieData.poster_path}" alt="${movieData.title}">
            <div class="synopsis">
                <h2>${movieData.title}</h2>
                <p>${movieData.overview}</p>
                <p>Date de sortie: ${movieData.release_date}</p>
                <p>Genres: ${movieData.genres.map(genre => genre.name).join(', ')}</p>
            </div>
        `;
        console.log(movieData.imdb_id)
        imdb_id = movieData.imdb_id;

        movieContainer.innerHTML = movieHTML;

        const url2 = 'https://imdb8.p.rapidapi.com/title/v2/get-business?tconst=' + imdb_id;
        const options2 = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '8cc2cf9290mshe7b85af954aa563p182979jsnfe362503c6de',
                'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
            }
        };

        fetch(url2, options2)
            .then(response => response.json())
            .then(result => {
                const revenueData = result.titleBoxOffice.gross.regional;
                createRegionalGrossChart(revenueData);
                // Appel de la fonction d'actualisation du type de graphique après que imdb_id a été défini
                updateChartType();
            })
            .catch(error => {
                console.error(error);
            });

        const statsData = {
            popularity: movieData.popularity,
            revenue: movieData.revenue,
            duration: movieData.runtime,
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
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                    ],
                    borderWidth: 1,
                }],
            },
        });
    })
    .catch(error => {
        console.error(error);
    });

function createRegionalGrossChart(regionalGrossData) {
    statsChart.destroy();
    const labels = regionalGrossData.map(region => region.regionName);
    const data = regionalGrossData.map(region => region.total.amount);

    const pieChartCtx = document.getElementById('statsChart').getContext('2d');
    statsChart = new Chart(pieChartCtx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                ],
            }],
        },
    });
}

function updateChartType() {
    const chartType = document.getElementById('chartType').value;

    if (chartType === 'popularity') {
        fetch('https://api.themoviedb.org/3/movie/' + <?php echo $movieId; ?> + '?language=fr-FR', options)
            .then(response => response.json())
            .then(movieData => {
                const statsData = {
                    popularity: movieData.popularity,
                };

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
    } else if (chartType === 'revenue') {
        fetch('https://api.themoviedb.org/3/movie/' + <?php echo $movieId; ?> + '?language=fr-FR', options)
            .then(response => response.json())
            .then(movieData => {
                const statsData = {
                    revenue: movieData.revenue,
                };

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
    } else if (chartType === 'gross') {
        const url2 = 'https://imdb8.p.rapidapi.com/title/v2/get-business?tconst=' + imdb_id;
        const options2 = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '8cc2cf9290mshe7b85af954aa563p182979jsnfe362503c6de',
                'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
            }
        };

        fetch(url2, options2)
            .then(response => response.json())
            .then(result => {
                const revenueData = result.titleBoxOffice.gross.regional;
                createRegionalGrossChart(revenueData);
            })
            .catch(error => {
                console.error(error);
            });
    }
}
</script>

</body>

</html>
