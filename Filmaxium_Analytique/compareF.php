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
        height:100vh;
        border-radius:25px;
    }
    </style>
<body>

<?php
session_start();
$selectedMovieId1 = isset($_SESSION['selectedMovieId']) ? $_SESSION['selectedMovieId'] : '';
$selectedMovieId2 = isset($_SESSION['selectedMovieId2']) ? $_SESSION['selectedMovieId2'] : '';
?>

<?php if ($selectedMovieId1 && $selectedMovieId2): ?>
    <div style="width: 80%; margin: auto;text-align:center">
        <canvas id="comparisonChart" width="400" height="200"></canvas>
    </div>

    <script>
        function fetchData(movieId, callback) {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://imdb8.p.rapidapi.com/title/v2/get-business?tconst=" + movieId,
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

        fetchData("<?php echo $selectedMovieId1; ?>", function (data1) {
            fetchData("<?php echo $selectedMovieId2; ?>", function (data2) {
                var ctx = document.getElementById('comparisonChart').getContext('2d');

                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Budget', 'Gross'],
                        datasets: [
                            {
                                label: 'Film 1',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                                data: [
                                    data1['titleBoxOffice']['budget']['amount'],
                                    data1['titleBoxOffice']['gross']['aggregations'][0]['total']['amount']
                                ]
                            },
                            {
                                label: 'Film 2',
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                borderColor: 'rgba(255, 99, 132, 1)',
                                borderWidth: 1,
                                data: [
                                    data2['titleBoxOffice']['budget']['amount'],
                                    data2['titleBoxOffice']['gross']['aggregations'][0]['total']['amount']
                                ]
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
            });
        });
    </script>
<?php endif; ?>

</body>
</html>
