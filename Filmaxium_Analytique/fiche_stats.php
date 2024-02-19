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
    height: 60vh; /* Adjust the percentage as needed */
    overflow: hidden; /* Add overflow property to prevent infinite scroll */
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
session_start();
include 'config.php';
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
    $movieId = isset($_GET['id']) ? '"' . $_GET['id'] . '"' : null;    
    ?>

    <div id="movie-container"></div>

    <div class="chart-container">
        <div class="chart-dropdown">
            <label for="chartType">Choisir le type de graphique : </label>
            <select id="chartType">
                <option value="votes">Votes</option>
                <option value="cast">Top Cast</option>
                <option value="revenue" >Revenu par région </option>
            </select>
        </div>
        <canvas id="combinedChart"></canvas>
    </div>

    <button id="scrollToTopBtn" onclick="scrollToTop()">Vers le haut</button>

    <script>
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
        $(document).ready(function () {
    var chartInstances = [];

    function destroyChart() {
        chartInstances.forEach(function (chart) {
            chart.destroy();
        });
        chartInstances = [];
    }

    document.getElementById('chartType').addEventListener('change', function () {
            const selectedChartType = this.value;

            // Destroy existing chart
            destroyChart();

            // Fetch data and create corresponding chart based on selected type
            switch (selectedChartType) {
                case 'votes':
                    // Fetch data for votes
                    getVotesData(imdb_id);
                    break;
                case 'cast':
                    // Fetch data for cast
                    getTopCastIDs(imdb_id, function (error, topCastIds) {
                        if (error) {
                            console.error('Erreur lors de la récupération des IDs du Top Cast:', error);
                        } else {
                            getPopularityDataForTopCast(topCastIds);
                        }
                    });
                    break;
                case 'revenue':
                    // Fetch data for revenue
                    getRevenueData(imdb_id);
                    break;
            }
        });



            


                destroyChart();

                getRevenueData(<?php echo isset($_GET['id']) ? '"' . $_GET['id'] . '"' : 'null'; ?>);
            });
            

            $('#revenueDropdown').on('change', function () {
                var selectedMovieId = $(this).val();

                destroyChart();

                getRevenueData(selectedMovieId);
            });
            var chartInstances = [];

            function destroyChart() {
    if (chartInstances.length > 0) {
        chartInstances.forEach(function (chart) {
            chart.destroy();
        });
        chartInstances = []; // Clear the chartInstances array
    }
}

            function getRevenueData(movieId) {
                destroyChart();
                const settings = {
                    async: true,
                    crossDomain: true,
                    url: 'https://imdb8.p.rapidapi.com/title/v2/get-business?tconst=' + movieId,
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': 'dd2c1605c6msh133a8e11ab6acc2p1cdf67jsn5b713979a5f4',
                        'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
                    }
                };

                $.ajax(settings).done(function (response) {
                    try {
                        console.log('Raw Response:', response); 

                        if (response && response.titleBoxOffice && response.titleBoxOffice.gross && response.titleBoxOffice.gross.regional) {
                            const revenueData = response.titleBoxOffice.gross.regional;
                            const movieName = response.title;

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

            function createCombinedChart(data1, movieName1, categories) {
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
                const ctx = document.getElementById('combinedChart').getContext('2d');

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
                        'X-RapidAPI-Key': 'dd2c1605c6msh133a8e11ab6acc2p1cdf67jsn5b713979a5f4',
                        'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
                    }
                };

                $.ajax(settings).done(function (response) {
                    try {
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

            function getCombinedVotesDetails(selectedMovieId) {
                const settings = {
                    async: true,
                    crossDomain: true,
                    url: 'https://imdb8.p.rapidapi.com/title/get-ratings?tconst=' + selectedMovieId,
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': 'dd2c1605c6msh133a8e11ab6acc2p1cdf67jsn5b713979a5f4',
                        'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
                    }
                };

                $.when(
                    $.ajax(settings)
                ).done(function (response1) {
                    const movieName1 = response1[0].title;
                    const categories = Object.keys(response1[0].ratingsHistograms['IMDb Users'].histogram);
                    const data1 = [
                        Object.values(response1[0].ratingsHistograms['IMDb Users'].histogram),
                    ];

                    createCombinedChart(data1, movieName1, categories);
                }).fail(function () {
                    console.error('Failed to fetch data for one or both movies.');
                });
            }

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
        .then(response => {
            const personResults = response.person_results;
            if (personResults && personResults.length > 0) {
                return personResults[0].popularity;
            } else {
                throw new Error('Invalid response structure or no person data available.');
            }
        })
        .catch(err => Promise.reject(err));
}


            function getPopularityDataForTopCast(topCastIds) {
                const popularityData = [];

                (async function loop() {
                    for (const id of topCastIds) {
                        try {
                            const popularity = await getPopularityData(id);
                            popularityData.push({
                                name: id,
                                popularity: popularity
                            });
                        } catch (error) {
                            console.error('Failed to fetch popularity data for ID:', id);
                        }
                    }

                    createPopularityBarChart(popularityData);
                })();
            }

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
