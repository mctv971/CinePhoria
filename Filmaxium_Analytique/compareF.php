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
        justify-content: center;
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
    #combinedChart {
        width: 80%;
        height: 100%;
        margin: auto;  /* Center the chart horizontally */
        text-align: center;
    }
</style>

<body>
<?php
session_start();
include 'config.php';
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
    <button id="castComparisonButton" data-attribute="cast">Top Cast</button>
</div>
       
    </div>

    <div>
        <canvas id="combinedChart" width="400" height="200"></canvas>
    </div>

    <script>
        $(document).ready(function () {
            var combinedChart = null;

            $('.button-container button').on('click', async function () {
    var selectedAttribute = $(this).data('attribute');

    var selectedMovieId = '<?php echo $_SESSION['selectedMovieId'] ?>';
    var selectedMovieId2 = '<?php echo $_SESSION['selectedMovieId2'] ?>';

    destroyChart();

    if (selectedAttribute === 'votes') {
        var selectedMovieId = '<?php echo $_SESSION['selectedMovieId'] ?>';
        var selectedMovieId2 = '<?php echo $_SESSION['selectedMovieId2'] ?>';
        await getCombinedVotesDetails(selectedMovieId, selectedMovieId2);
    } else if (selectedAttribute === 'revenue') {
        var selectedMovieId = '<?php echo $_SESSION['selectedMovieId'] ?>';
        var selectedMovieId2 = '<?php echo $_SESSION['selectedMovieId2'] ?>';
        var selectedRevenueMovieId = $('#revenueDropdown').val();
        getRevenueData(selectedRevenueMovieId);
    } else if (selectedAttribute === 'cast') {
        const topCastDetailsMovie1 = await getTopCastDetails(selectedMovieId);
        const topCastDetailsMovie2 = await getTopCastDetails(selectedMovieId2);

        if (topCastDetailsMovie1 && topCastDetailsMovie2) {
            createCombinedCastChart(topCastDetailsMovie1, topCastDetailsMovie2);
        }

        // Maintenant, vous pouvez attribuer un score de popularité à chaque acteur et utiliser ces données pour créer votre graphique.
    } else {
        getMovieDetails(selectedMovieId, selectedMovieId2, selectedAttribute);
    }
});


            $('#switchMovieButton').on('click', function () {
                const currentMovieId = $('#movieSelection').val();
                const newMovieId = currentMovieId === '<?php echo $_SESSION['selectedMovieId'] ?>'
                    ? '<?php echo $_SESSION['selectedMovieId2'] ?>'
                    : '<?php echo $_SESSION['selectedMovieId'] ?>';

                $('#movieSelection').val(newMovieId);

                destroyChart();

                getRevenueData(newMovieId);
            });
            

            $('#revenueDropdown').on('change', function () {
                var selectedMovieId = $(this).val();

                destroyChart();

                getRevenueData(selectedMovieId);
            });
            var chartInstances = [];

            function destroyChart() {
    chartInstances.forEach(function (chart) {
        chart.destroy();
    });
    chartInstances = [];
}

async function getTopCastDetails(movieId) {
    const url = 'https://imdb8.p.rapidapi.com/title/get-top-cast?tconst=' + movieId;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '4af10acecamsh208e06566c5c57dp183d71jsnd3b78c58d16e',
            'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (Array.isArray(data)) {
            const castIds = data.slice(0, 5).map(id => id.replace('/name/', '').replace('/', ''));

            // Récupérer la popularité pour chaque acteur
            const popularityData = await Promise.all(castIds.map(id => getActorPopularity(id)));

            return { castIds, popularityData };
        } else {
            console.error('Invalid response structure for top cast details. Expected an array.');
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getActorDetails(actorId) {
    const options = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjVlNWQ5OTUxYTdiNzg0ZTZkMDBjZjk3OGU4YjcyYyIsInN1YiI6IjY1Mzc3YzIxYzUwYWQyMDEyZGY0YjI2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jMOywP2uIuyrtnbX0kYWNkbGf0wTMUnNmKsFrNhcVXU'
        }
    };

    try {
        const response = await fetch('https://api.themoviedb.org/3/person/' + actorId, options);
        const data = await response.json();
        return data.known_for_department;
    } catch (error) {
        console.error(error);
        return null;
    }
}


async function getActorPopularity(actorId) {
    const options = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjVlNWQ5OTUxYTdiNzg0ZTZkMDBjZjk3OGU4YjcyYyIsInN1YiI6IjY1Mzc3YzIxYzUwYWQyMDEyZGY0YjI2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jMOywP2uIuyrtnbX0kYWNkbGf0wTMUnNmKsFrNhcVXU'
        }
    };

    try {
        const response = await fetch('https://api.themoviedb.org/3/find/' + actorId + '?external_source=imdb_id', options);
        const data = await response.json();
        return data.person_results[0].popularity;
    } catch (error) {
        console.error(error);
    }
}

async function createCombinedCastChart(topCastDetailsMovie1, topCastDetailsMovie2) {
    const castIds1 = topCastDetailsMovie1.castIds;
    const castNames1 = await getCastNames(castIds1);

    const popularityData1 = topCastDetailsMovie1.popularityData;

    const castIds2 = topCastDetailsMovie2.castIds;
    const castNames2 = await getCastNames(castIds2);

    const popularityData2 = topCastDetailsMovie2.popularityData;

    // Function to get the names of the cast members using TMDB API
    async function getCastNames(castIds) {
        const names = await Promise.all(castIds.map(async (id) => {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjVlNWQ5OTUxYTdiNzg0ZTZkMDBjZjk3OGU4YjcyYyIsInN1YiI6IjY1Mzc3YzIxYzUwYWQyMDEyZGY0YjI2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jMOywP2uIuyrtnbX0kYWNkbGf0wTMUnNmKsFrNhcVXU'
                }
            };

            const response = await fetch('https://api.themoviedb.org/3/find/' + id + '?external_source=imdb_id', options);
            const data = await response.json();
            
            return data.person_results[0].name;
        }));

        return names;
    }

    // Fonction pour obtenir l'indice du maximum
    const getMaxIndex = (data) => {
        return data.map((_, i) => i).reduce((maxIndex, currentIndex) => data[currentIndex] > data[maxIndex] ? currentIndex : maxIndex, 0);
    };

    // Trier les données par popularité
    const sortedIndices1 = castIds1.map((_, i) => i).sort((a, b) => popularityData1[b] - popularityData1[a]);
    const sortedIndices2 = castIds2.map((_, i) => i).sort((a, b) => popularityData2[b] - popularityData2[a]);

    // Appliquer le tri aux données
    const sortedCastNames1 = sortedIndices1.map(index => castNames1[index]);
    const sortedPopularityData1 = sortedIndices1.map(index => popularityData1[index]);

    const sortedCastNames2 = sortedIndices2.map(index => castNames2[index]);
    const sortedPopularityData2 = sortedIndices2.map(index => popularityData2[index]);

    const ctx = document.getElementById('combinedChart').getContext('2d');

    const barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [...sortedCastNames1, ...sortedCastNames2],
            datasets: [{
                label: 'Top 5 Cast - Movie 1',
                data: [...sortedPopularityData1, ...Array(5).fill(null)],
                backgroundColor: '#FF5733',
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1
            }, {
                label: 'Top 5 Cast - Movie 2',
                data: [...Array(5).fill(null), ...sortedPopularityData2],
                backgroundColor: '#FC33FF',
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1,
                borderDash: [5, 5]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            tooltips: {
                callbacks: {
                    label: function (context) {
                        const castIndex = context.dataIndex;
                        const isMovie1 = castIndex < sortedCastNames1.length;

                        const castDetails = isMovie1 ? topCastDetailsMovie1 : topCastDetailsMovie2;
                        const castName = castDetails.castNames[castIndex];
                        const knownForDepartment = castDetails.knownForDepartments[castIndex];

                        return `${castName} - ${knownForDepartment}`;
                    }
                }
            }
        }
    });

    chartInstances.push(barChart);
}


function getRandomColorArray(length) {
    const colorArray = [];
    for (let i = 0; i < length; i++) {
        const randomColor = getRandomColor();
        colorArray.push(randomColor);
    }
    return colorArray;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


            function getRevenueData(movieId) {
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
                const filteredData = data.filter(region => region.regionName !== "Domestic");

// Trier les données par ordre décroissant de revenus
const sortedData = filteredData.sort((a, b) => b.total.amount - a.total.amount);

    // Sélectionner les 20 premières régions
    const top20Regions = sortedData.slice(0, 20);

    // Calculer le total des revenus pour les régions restantes
    const otherRegionsTotal = sortedData.slice(20).reduce((total, region) => total + region.total.amount, 0);

    // Créer un tableau avec les 20 régions principales et une entrée pour "autre"
    const finalData = [...top20Regions, { regionName: "Autre", total: { amount: otherRegionsTotal } }];

    const ctx = document.getElementById('combinedChart').getContext('2d');

    const newChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: finalData.map(region => region.regionName),
            datasets: [{
                label: movieName,
                data: finalData.map(region => region.total.amount),
                backgroundColor: getRandomColorArray(finalData.length),
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


            function getCombinedVotesDetails(selectedMovieId, selectedMovieId2) {
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

                const settings2 = {
                    async: true,
                    crossDomain: true,
                    url: 'https://imdb8.p.rapidapi.com/title/get-ratings?tconst=' + selectedMovieId2,
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': 'dd2c1605c6msh133a8e11ab6acc2p1cdf67jsn5b713979a5f4',
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

        });
    </script>
</body>
</html>