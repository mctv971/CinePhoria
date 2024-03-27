<!DOCTYPE html>
<html>
<head>
    <title>Graphiques</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
</head>
<body>

<h2>Générer un graphique :</h2>

<button onclick="genererGraphique1()">Graphique 1</button>
<button onclick="genererGraphique2()">Graphique 2</button>

<canvas id="myChart" width="400" height="400"></canvas>

<script>
// Fonction pour générer le graphique 1
function genererGraphique1() {
    // IDs IMDB des deux acteurs
    const idIMDBActeur1 = "nm0000138"; // Exemple
    const idIMDBActeur2 = "nm0000148"; // Exemple

    // Fonction pour récupérer les 5 films les plus connus d'un acteur à partir de son ID IMDB
    function recupererTop5Films(idIMDB) {
        const settings = {
            async: true,
            crossDomain: true,
            url: `https://imdb8.p.rapidapi.com/actors/v2/get-know-for?nconst=${idIMDB}&first=5`,
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '8cc2cf9290mshe7b85af954aa563p182979jsnfe362503c6de',
                'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
            }
        };

        return $.ajax(settings);
    }

    // Fonction pour récupérer la popularité d'un film à partir de son ID IMDB
    function recupererPopulariteFilm(idIMDB) {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjVlNWQ5OTUxYTdiNzg0ZTZkMDBjZjk3OGU4YjcyYyIsInN1YiI6IjY1Mzc3YzIxYzUwYWQyMDEyZGY0YjI2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jMOywP2uIuyrtnbX0kYWNkbGf0wTMUnNmKsFrNhcVXU'
            }
        };

        return fetch(`https://api.themoviedb.org/3/find/${idIMDB}?external_source=imdb_id`, options)
            .then(response => response.json())
            .then(response => {
                const movieResults = response.movie_results;
                if (movieResults && movieResults.length > 0) {
                    return {
                        idIMDB: idIMDB, // Ajout de l'ID IMDB du film
                        titre: movieResults[0].title,
                        popularite: movieResults[0].popularity
                    };
                } else {
                    return null; // Si aucune correspondance trouvée
                }
            });
    }

    // Récupération des données pour les deux acteurs
    const promiseActeur1 = recupererTop5Films(idIMDBActeur1);
    const promiseActeur2 = recupererTop5Films(idIMDBActeur2);

    // Traitement des données une fois qu'elles sont disponibles
    $.when(promiseActeur1, promiseActeur2).done(function(responseActeur1, responseActeur2) {
        const top5IdsActeur1 = responseActeur1[0].data.name.knownFor.edges.map(edge => edge.node.title.id);
        const top5IdsActeur2 = responseActeur2[0].data.name.knownFor.edges.map(edge => edge.node.title.id);

        console.log("Top 5 IDs des films de l'acteur 1:", top5IdsActeur1);
        console.log("Top 5 IDs des films de l'acteur 2:", top5IdsActeur2);

        // Promesses pour récupérer les informations de popularité pour les films des deux acteurs
        const promessesPopulariteActeur1 = top5IdsActeur1.map(idIMDB => recupererPopulariteFilm(idIMDB));
        const promessesPopulariteActeur2 = top5IdsActeur2.map(idIMDB => recupererPopulariteFilm(idIMDB));

        // Résolution des promesses une fois que toutes sont terminées
        Promise.all(promessesPopulariteActeur1.concat(promessesPopulariteActeur2)).then(results => {
            const populariteActeur1 = [];
            const populariteActeur2 = [];

            results.forEach(result => {
                if (result) {
                    if (top5IdsActeur1.includes(result.idIMDB)) {
                        populariteActeur1.push(result);
                    } else if (top5IdsActeur2.includes(result.idIMDB)) {
                        populariteActeur2.push(result);
                    }
                }
            });

            console.log("Popularité des films de l'acteur 1:", populariteActeur1);
            console.log("Popularité des films de l'acteur 2:", populariteActeur2);

            // Fusionner les données de popularité des deux acteurs
            const mergedPopularite = populariteActeur1.concat(populariteActeur2);
// Tri des données fusionnées en fonction de la popularité des films
mergedPopularite.sort((a, b) => a.popularite - b.popularite);

// Création du bar chart
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: mergedPopularite.map(film => film.titre),
        datasets: [{
            label: 'Acteur 1',
            data: mergedPopularite.map(film => {
                // Si le film est dans les données de l'acteur 1, retourne sa popularité, sinon 0
                return populariteActeur1.find(item => item.idIMDB === film.idIMDB) ? film.popularite : 0;
            }),
            backgroundColor: mergedPopularite.map(film => {
                // Couleur rouge pour les films de l'acteur 1
                return populariteActeur1.find(item => item.idIMDB === film.idIMDB) ? 'rgba(255, 99, 132, 0.2)' : 'rgba(0, 0, 0, 0)';
            }),
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }, {
            label: 'Acteur 2',
            data: mergedPopularite.map(film => {
                // Si le film est dans les données de l'acteur 2, retourne sa popularité, sinon 0
                return populariteActeur2.find(item => item.idIMDB === film.idIMDB) ? film.popularite : 0;
            }),
            backgroundColor: mergedPopularite.map(film => {
                // Couleur bleue pour les films de l'acteur 2
                return populariteActeur2.find(item => item.idIMDB === film.idIMDB) ? 'rgba(54, 162, 235, 0.2)' : 'rgba(0, 0, 0, 0)';
            }),
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            xAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

        });
    });
}
function genererGraphique2() {
    const idIMDBActeurs = ["nm0000138", "nm0000148"]; // Tableau contenant les IDs IMDB des acteurs
    const promises = idIMDBActeurs.map(id => {
        return new Promise((resolve, reject) => {
            const settings = {
                async: true,
                crossDomain: true,
                url: `https://imdb8.p.rapidapi.com/actors/v2/get-did-you-know-summary?nconst=${id}`,
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '8cc2cf9290mshe7b85af954aa563p182979jsnfe362503c6de',
                    'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
                }
            };

            $.ajax(settings).done(function (response) {
                resolve(response);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                reject(errorThrown);
            });
        });
    });

    Promise.all(promises).then(responses => {
        const datasets = responses.map(response => {
            const data = response.data;
            const name = data.name;
            const trivia = name.trivia;
            const edges = trivia.edges;
            const labels = edges.map(edge => edge.node.text.plainText);
            const usersInterested = edges.map(edge => edge.node.interestScore.usersInterested);
            return {
                labels: labels,
                data: usersInterested
            };
        });

        // Calcul de la somme des intérêts pour chaque acteur
        const sums = datasets.map(dataset => dataset.data.reduce((acc, curr) => acc + curr, 0));
        
        // Calcul de la somme totale des intérêts
        const totalSum = sums.reduce((acc, curr) => acc + curr, 0);

        // Calcul de la part de chaque acteur par rapport à la somme totale
        const percentages = sums.map(sum => (sum / totalSum) * 100);

        // Création du graphique
        const ctx = document.getElementById('myChart').getContext('2d');
        const mySecondChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: datasets.map((dataset, index) => {
                    return {
                        label: `Acteur ${index + 1}`,
                        data: dataset.data.map((value, i) => (value / sums[index]) * percentages[index]),
                        backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
                        borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
                        borderWidth: 1
                    };
                }),
                labels: datasets[0].labels // Utilisation des mêmes libellés pour tous les ensembles de données
            }
        });
    }).catch(error => {
        console.error('Une erreur s\'est produite :', error);
    });
}


</script>
</body>
</html>

