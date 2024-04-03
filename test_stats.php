<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Test statistique sur les films</title>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>

<select id="variableSelect1">
    <option value="budget">Budget</option>
    <option value="revenue">Revenue</option>
    <option value="runtime">Duree</option>
    <option value="popularity">Popularite</option>
    <option value="vote_count">Nombre de Votes</option>
</select>

<select id="variableSelect2">
    <option value="budget">Budget</option>
    <option value="revenue">Revenue</option>
    <option value="runtime">Duree</option>
    <option value="popularity">Popularite</option>
    <option value="vote_count">Nombre de Votes</option>
</select>

<select id="clusterCount">
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
    <option value="5">5</option>
    <!-- Ajoutez autant d'options que vous jugez nécessaires -->
</select>

<select id="testSelect">
    <option value="pearson">Test de corrélation de Pearson</option>
    <option value="regression">Test du regression Lineaire</option>
    <option value="cluestering">Affichage du Cluestering</option>
</select>

<button id="executeTestButton">Exécuter le test</button>

<div id="myDiv"></div>
<canvas id="correlationChart" width="400" height="400"></canvas>

<h2>Données récupérées</h2>
<table id="dataTable">
    <thead>
        <tr>
            <th>Titre du film</th>
            <th>Variable 1</th>
            <th>Variable 2</th>
        </tr>
    </thead>
    <tbody id="dataBody">
    </tbody>
</table>

<script>

$(document).ready(function() {

    const idTmdbList = [1011985, 359410, 823464, 634492, 601796, 763215, 856289, 1096197, 624091, 940551, 1006540, 1013240, 693134, 969492, 1124127, 932420, 1239251, 1046090, 1049948, 848538, 848538, 1081620, 787699, 940721, 872585, 792307, 870404, 1072790, 399566, 967847, 1211483, 1216512, 1022796, 984249, 438631, 572802, 609681, 1217409, 802219, 851925, 572802, 1125311, 866398, 1227816, 840889, 1094556, 682075, 1028703, 897087, 124905, 983526, 949429, 695721, 1248795, 502356, 370464, 885303, 1022789, 508883, 59300, 9502, 838240, 753342, 799155, 933131, 1010581, 1146148, 373571, 76600, 634649, 1079394, 976573, 1212073, 1029575, 346698, 1019420, 931642, 714567, 1079485, 569094, 981347, 838240, 982940, 634649, 603692, 1161663, 955916, 6844, 976573, 503417, 528656, 425909, 977331, 872542, 838209, 315162, 1079485, 299536, 848326, 1183905, 299054, 1170657, 49444, 963591, 157336, 918692, 853812, 615656, 977331, 414906, 298618, 1205781, 926393, 901362, 1139566, 140300, 254, 671, 150540, 893723,949567, 854188, 1058078, 671, 853812, 299054, 1139566, 505642, 293660, 965571, 1205781, 653346, 918692, 4011, 1078012, 293167, 891699, 672, 116776, 475557];
    let data = [];
    let data2 = [];
    function getSelectedClusterCount() {
        return parseInt($('#clusterCount').val());
    }
//--------------------------------Recupération des données-----------------------------
    async function getMovieInfo(movieId) {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjVlNWQ5OTUxYTdiNzg0ZTZkMDBjZjk3OGU4YjcyYyIsInN1YiI6IjY1Mzc3YzIxYzUwYWQyMDEyZGY0YjI2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jMOywP2uIuyrtnbX0kYWNkbGf0wTMUnNmKsFrNhcVXU'
            }
        };
        const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données du film');
            }
            const movieData = await response.json();
            console.log(movieData);
            return movieData;
        
        } catch (error) {
            console.error('Error fetching movie data:', error);
            throw error; // Propager l'erreur pour qu'elle soit capturée par l'appelant
        }
    }

    async function fillData(var1, var2) {
    $('#dataBody').empty(); // Vide le contenu actuel du tableau
    data = []; // Réinitialiser le tableau de données
    for (const movieId of idTmdbList) {
        try {
            const movieData = await getMovieInfo(movieId);
            const var1Value = movieData[var1];
            const var2Value = movieData[var2];

            // Vérifier si les valeurs des variables sont non nulles
            if (var1Value !== 0 && var2Value !== 0) {
                const movieTitle = movieData['title'] || 'Unknown';
                data.push({ movieId, [var1]: var1Value, [var2]: var2Value, movieTitle });
                // Ajoute une ligne au tableau pour chaque film récupéré
                $('#dataBody').append(`<tr><td>${movieTitle}</td><td>${var1Value}</td><td>${var2Value}</td></tr>`);
            }
        } catch (error) {
            console.error('Error fetching movie data:', error);
        }
    }
}

    async function fillData2() {
    $('#dataBody').empty(); // Vide le contenu actuel du tableau
    data2 = []; // Réinitialiser le tableau de données
    for (const movieId of idTmdbList) {
        try {
            const movieData = await getMovieInfo(movieId);
            const movieVariables = {
                title: movieData.original_title,
                budget: movieData.budget,
                revenue: movieData.revenue,
                popularity: movieData.popularity,
                runtime: movieData.runtime,
                vote_count: movieData.vote_count
            };
            data2.push(movieVariables); // Ajouter les données du film à la liste des données
        } catch (error) {
            console.error('Error fetching movie data:', error);
        }
    }
}


//----------------------------------------------------------------------------------


//--------------------------------Calcul de Pearson---------------------------------
function calculatePearsonCorrelation(x, y) {
        const n = x.length;
        let sumX = 0;
        let sumY = 0;
        let sumXY = 0;
        let sumX2 = 0;
        let sumY2 = 0;

        for (let i = 0; i < n; i++) {
            sumX += x[i];
            sumY += y[i];
            sumXY += x[i] * y[i];
            sumX2 += x[i] ** 2;
            sumY2 += y[i] ** 2;
        }

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX ** 2) * (n * sumY2 - sumY ** 2));

        return numerator / denominator;
    }

function displayScatterPlot(x, y) {
        var ctx = document.getElementById('correlationChart').getContext('2d');
        var scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Corrélation entre Budget et Revenue',
                    data: data.map(row => ({x: row.budget, y: row.revenue, title: row.movieTitle})),
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Budget'
                        }
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Revenue'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.data[context.dataIndex].title;
                            }
                        }
                    }
                }
            }
        });
}

//--------------------------------------------------------------------------------


//--------------------------------------Regression Linéaire------------------------
function performLinearRegression(x, y) {
    // Calculer les moyennes
    const n = x.length;
    const meanX = x.reduce((acc, val) => acc + val, 0) / n;
    const meanY = y.reduce((acc, val) => acc + val, 0) / n;

    // Calculer les coefficients de régression
    let numerator = 0;
    let denominator = 0;
    for (let i = 0; i < n; i++) {
        numerator += (x[i] - meanX) * (y[i] - meanY);
        denominator += (x[i] - meanX) ** 2;
    }
    const slope = numerator / denominator;
    const intercept = meanY - slope * meanX;

    // Afficher le graphique de régression linéaire
    displayLinearRegressionPlot(meanX, meanY, slope, intercept);
}

function displayLinearRegressionPlot(meanX, meanY, slope, intercept) {
    var ctx = document.getElementById('correlationChart').getContext('2d');
    var scatterChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Données',
                data: data.map(row => ({x: row[variable1], y: row[variable2], title: row.movieTitle})),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }, {
                label: 'Régression linéaire',
                type: 'line',
                data: [{x: Math.min(...data.map(row => row[variable1])), y: slope * Math.min(...data.map(row => row[variable1])) + intercept},
                       {x: Math.max(...data.map(row => row[variable1])), y: slope * Math.max(...data.map(row => row[variable1])) + intercept}],
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Budget'
                    }
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Revenue'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.dataset.label === 'Données') {
                                return context.dataset.data[context.dataIndex].title;
                            } else {
                                return 'Régression: y = ' + slope.toFixed(2) + 'x + ' + intercept.toFixed(2);
                            }
                        }
                    }
                }
            }
        }
    });
}
//-------------------------------------------------------------------------------

//-------------------------------------Clustering-------------------------------

/**
 * Effectue le clustering K-Means sur un ensemble de données.
 * 
 * @param {Array} data Un tableau d'objets, chaque objet représentant un point de données avec x et y comme variables à clusteriser.
 * @param {number} numClusters Le nombre de clusters à former.
 * @returns {Object} Un objet contenant deux propriétés: assignments (l'affectation de chaque point à un cluster) et centers (les centres des clusters).
 */
async function performClustering(data, numClusters) {
    let centers = initializeCenters(data, numClusters);
    let assignments = [];
    let previousAssignments = [];
    let maxIterations = 100;
    let iteration = 0;

    do {
        // Assignation des points aux clusters
        assignments = data.map(d => assignToClosestCenter(d, centers));

        // Vérification de la convergence
        if (arraysEqual(assignments, previousAssignments) || iteration >= maxIterations) {
            break;
        }

        // Mise à jour des centres
        centers = updateCenters(data, assignments, numClusters);

        previousAssignments = assignments.slice();
        iteration++;
    } while (true);

    return { assignments, centers };
}

function initializeCenters(data, numClusters) {
    // Sélection aléatoire de points comme centres initiaux
    let shuffled = data.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numClusters);
}

function assignToClosestCenter(point, centers) {
    let minDistance = Infinity;
    let closestCenterIndex = -1;

    centers.forEach((center, index) => {
        let distance = Math.sqrt((point.x - center.x) ** 2 + (point.y - center.y) ** 2);
        if (distance < minDistance) {
            minDistance = distance;
            closestCenterIndex = index;
        }
    });

    return closestCenterIndex;
}

function updateCenters(data, assignments, numClusters) {
    let centers = Array(numClusters).fill(null).map(() => ({ x: 0, y: 0, count: 0 }));

    // Accumuler les valeurs pour le calcul de la moyenne
    data.forEach((point, index) => {
        let clusterIndex = assignments[index];
        if (centers[clusterIndex]) { // Vérification de l'existence du centre
            centers[clusterIndex].x += point.x;
            centers[clusterIndex].y += point.y;
            centers[clusterIndex].count += 1;
        }
    });

    // Calculer la nouvelle position des centres
    return centers.map(center => center.count > 0 ? {
        x: center.x / center.count,
        y: center.y / center.count
    } : center); // Retourne le centre inchangé si aucun point ne lui est assigné
}



function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
}

function displayClusters(data, assignments) {
    // Utilisez Plotly ou une autre bibliothèque de graphiques pour afficher les clusters
    var trace = {
        x: data.map(d => d.x), // Remplacez 'x' par la variable sélectionnée pour l'axe des X
        y: data.map(d => d.y), // Remplacez 'y' par la variable sélectionnée pour l'axe des Y
        mode: 'markers',
        type: 'scatter',
        marker: {color: assignments}, // Utilisez les affectations de cluster pour la couleur
        text: data.map(d => d.movieTitle) // Titres des films pour les tooltips
    };
    
    var layout = {
        title: 'Visualisation des Clusters',
        xaxis: {title: 'Variable X'}, // Mettez à jour selon la variable sélectionnée
        yaxis: {title: 'Variable Y'} // Mettez à jour selon la variable sélectionnée
    };
    
    Plotly.newPlot('myDiv', [trace], layout);
}
//---------------------------------------------------------------------------------


//-----------------------------GERER LES DONNES VIA LES DROPDOWNS----------------------

async function performSelectedTest(selectedTest, var1, var2, numClusters) {
    if (selectedTest === 'pearson') {
        // Calculer la corrélation de Pearson
        const columnVar1 = data.map(row => row[var1]);
        const columnVar2 = data.map(row => row[var2]);
        const correlation = calculatePearsonCorrelation(columnVar1, columnVar2);
        console.log('Corrélation de Pearson:', correlation);
        displayScatterPlot(columnVar1, columnVar2);
    } else if (selectedTest === 'regression') {
        // Extraire les données pour la régression linéaire
        const x = data.map(row => row[var1]);
        const y = data.map(row => row[var2]);
        // Exécuter la régression linéaire avec les données correctes
        performLinearRegression(x, y);
    } else if (selectedTest === 'cluestering') {
        // Assurez-vous que la fonction fillData a été appelée pour remplir 'data' avec les données correctes
        const variableData = data.map(d => ({x: d[var1], y: d[var2], movieTitle: d.movieTitle}));
        const clusteringResults = await performClustering(variableData, numClusters); // Utilisez 'variableData' ici
        displayClusters(variableData, clusteringResults.assignments); // Passez les données correctes et les assignments ici
    }
}

$('#executeTestButton').click(async function() { // Assurez-vous que cette fonction est async pour attendre performSelectedTest
    const selectedTest = $('#testSelect').val();
    const variable1 = $('#variableSelect1').val();
    const variable2 = $('#variableSelect2').val();
    console.log('Test statistique sélectionné:', selectedTest);
    console.log('Variable 1 sélectionnée:', variable1);
    console.log('Variable 2 sélectionnée:', variable2);
    const numClusters = getSelectedClusterCount(); // Obtenez le nombre de clusters sélectionné
    await performSelectedTest(selectedTest, variable1, variable2, numClusters); // Ajoutez await ici
});

$('#variableSelect1, #variableSelect2').change(function() {
    const variable1 = $('#variableSelect1').val();
    const variable2 = $('#variableSelect2').val();
    fillData(variable1, variable2); // Remplir le tableau avec les nouvelles variables
    // Notez que fillData doit être adapté pour manipuler et stocker les données de manière à ce que performSelectedTest puisse les utiliser correctement
});

    const variable1 = $('#variableSelect1').val();
    const variable2 = $('#variableSelect2').val();
    fillData(variable1, variable2); // Assurez-vous que cette initialisation appelle fillData correctement

});
//----------------------------------------------------------------------------
</script>

</body>
</html>
