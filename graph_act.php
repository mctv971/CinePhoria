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
<button onclick="genererGraphique3()">Graphique 3</button>

<canvas id="myChart" width="400" height="400"></canvas>

<script>
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
    const settingsActeur1 = {
        async: true,
        crossDomain: true,
        url: 'https://imdb8.p.rapidapi.com/actors/v2/get-did-you-know-summary?nconst=nm0000138',
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '8cc2cf9290mshe7b85af954aa563p182979jsnfe362503c6de',
            'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
        }
    };

    const settingsActeur2 = {
        async: true,
        crossDomain: true,
        url: 'https://imdb8.p.rapidapi.com/actors/v2/get-did-you-know-summary?nconst=nm0000148',
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '8cc2cf9290mshe7b85af954aa563p182979jsnfe362503c6de',
            'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
        }
    };

    $.when($.ajax(settingsActeur1), $.ajax(settingsActeur2)).done(function(responseActeur1, responseActeur2) {
        const nomActeur1 = responseActeur1[0].data.name.nameText.text;
        const nomActeur2 = responseActeur2[0].data.name.nameText.text;
        const usersInterestedActeur1 = responseActeur1[0].data.name.trivia.edges[0].node.interestScore.usersInterested;
        const usersInterestedActeur2 = responseActeur2[0].data.name.trivia.edges[0].node.interestScore.usersInterested;

        // Création du doughnut chart
        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [nomActeur1, nomActeur2],
                datasets: [{
                    label: 'Users Interested',
                    data: [usersInterestedActeur1, usersInterestedActeur2],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    });
}


function genererGraphique3() {
    
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjVlNWQ5OTUxYTdiNzg0ZTZkMDBjZjk3OGU4YjcyYyIsInN1YiI6IjY1Mzc3YzIxYzUwYWQyMDEyZGY0YjI2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jMOywP2uIuyrtnbX0kYWNkbGf0wTMUnNmKsFrNhcVXU'
        }
    };

    // Fonction pour récupérer l'ID TMDB à partir de l'ID IMDb
    function getIdTMDB(imdbId) {
        const fetchUrl = `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id`;
        return fetch(fetchUrl, options)
            .then(response => response.json())
            .then(data => {
                // Vérification si des résultats ont été trouvés
                if (data.person_results.length > 0) {
                    // Renvoyer l'ID TMDB du premier résultat trouvé
                    return data.person_results[0].id;
                } else {
                    // Si aucun résultat trouvé, renvoyer une erreur
                    throw new Error("Aucun résultat trouvé pour cet ID IMDb.");
                }
            });
    }

    // Fonction pour récupérer le nom de l'acteur à partir de l'ID TMDB
    function getActorName(tmdbId) {
        const fetchUrl = `https://api.themoviedb.org/3/person/${tmdbId}?language=fr-FR`;
        return fetch(fetchUrl, options)
            .then(response => response.json())
            .then(data => {
                // Vérification si des résultats ont été trouvés
                if (data.name) {
                    // Renvoyer le nom de l'acteur
                    return data.name;
                } else {
                    // Si aucun résultat trouvé, renvoyer une erreur
                    throw new Error("Aucun nom trouvé pour cet ID TMDB.");
                }
            });
    }

    // ID IMDb des deux acteurs à comparer
    const imdbIdActeur1 = 'nm0000138'; // ID IMDb de Leonardo DiCaprio
    const imdbIdActeur2 = 'nm0000148'; // ID IMDb de Harrison Ford

    // Traduction des ID IMDb en ID TMDB pour les deux acteurs
    Promise.all([getIdTMDB(imdbIdActeur1), getIdTMDB(imdbIdActeur2)])
        .then(([tmdbIdActeur1, tmdbIdActeur2]) => {
            // Récupération des noms des acteurs
            return Promise.all([getActorName(tmdbIdActeur1), getActorName(tmdbIdActeur2)])
                .then(([nomActeur1, nomActeur2]) => {
                    // URLs des crédits de films et de séries pour chaque acteur avec les ID TMDB correspondants
                    const apiUrlActeur1Films = `https://api.themoviedb.org/3/person/${tmdbIdActeur1}/movie_credits?language=fr-FR`;
                    const apiUrlActeur1Series = `https://api.themoviedb.org/3/person/${tmdbIdActeur1}/tv_credits?language=fr-FR`;
                    const apiUrlActeur2Films = `https://api.themoviedb.org/3/person/${tmdbIdActeur2}/movie_credits?language=fr-FR`;
                    const apiUrlActeur2Series = `https://api.themoviedb.org/3/person/${tmdbIdActeur2}/tv_credits?language=fr-FR`;

                    // Requêtes pour récupérer les crédits de films et de séries pour chaque acteur
                    const promises = [
                        fetch(apiUrlActeur1Films, options),
                        fetch(apiUrlActeur1Series, options),
                        fetch(apiUrlActeur2Films, options),
                        fetch(apiUrlActeur2Series, options)
                    ];

                    // Récupération des données une fois que toutes les requêtes sont terminées
                    return Promise.all(promises)
                        .then(responses => Promise.all(responses.map(response => response.json())))
                        .then(data => {
                            const nbFilmsActeur1 = data[0].cast.length;
                            const nbSeriesActeur1 = data[1].cast.length;
                            const nbFilmsActeur2 = data[2].cast.length;
                            const nbSeriesActeur2 = data[3].cast.length;

                            // Création du bar chart
                            const ctx = document.getElementById('myChart').getContext('2d');
                            const myChart = new Chart(ctx, {
                                type: 'bar',
                                data: {
                                    labels: [`${nomActeur1} (Films)`, `${nomActeur1} (Séries)`, `${nomActeur2} (Films)`, `${nomActeur2} (Séries)`],
                                    datasets: [{
                                        label: 'Nombre de films/séries joués',
                                        data: [nbFilmsActeur1, nbSeriesActeur1, nbFilmsActeur2, nbSeriesActeur2],
                                        backgroundColor: [
                                            'rgba(255, 99, 132, 0.2)',
                                            'rgba(255, 159, 64, 0.2)',
                                            'rgba(54, 162, 235, 0.2)',
                                            'rgba(75, 192, 192, 0.2)'
                                        ],
                                        borderColor: [
                                            'rgba(255, 99, 132, 1)',
                                            'rgba(255, 159, 64, 1)',
                                            'rgba(54, 162, 235, 1)',
                                            'rgba(75, 192, 192, 1)'
                                        ],
                                        borderWidth: 1
                                    }]
                                },
                                options: {
                                    scales: {
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
        })
        .catch(error => console.error('Erreur lors de la récupération des données:', error));
}






</script>
</body>
</html>

