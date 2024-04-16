// Fonction pour créer des bouquets en fonction de la durée
function creerBouquets(titresSimilaires) {
    var bouquets = {
        '3h': [],
        '8h': [],
        '24h': []
    };

    // Parcourir les titres similaires et les ajouter aux bouquets appropriés
    titresSimilaires.forEach(function(titre) {
        // Choisissez le bouquet en fonction de la durée du titre
        if (titre.duration <= 180) { // 3 heures en minutes
            bouquets['3h'].push(titre);
        } else if (titre.duration <= 480) { // 8 heures en minutes
            bouquets['8h'].push(titre);
        } else if (titre.duration <= 1440) { // 24 heures en minutes
            bouquets['24h'].push(titre);
        }
    });

    return bouquets;
}

// Fonction pour afficher les bouquets dans l'interface utilisateur
function afficherBouquets(bouquets) {
    // Sélectionnez l'élément HTML où vous souhaitez afficher les bouquets
    var container = $('#bouquets-container');

    // Effacez le contenu précédent du conteneur
    container.empty();

    // Parcourir les bouquets et afficher les titres dans l'interface utilisateur
    Object.keys(bouquets).forEach(function(duree) {
        var bouquetElement = $('<div>').addClass('bouquet').text(duree + ' Bouquet');
        container.append(bouquetElement);
        bouquets[duree].forEach(function(titre) {
            var titreElement = $('<div>').text(titre.title);
            bouquetElement.append(titreElement);
        });
    });
}

// Fonction pour récupérer les favoris de l'utilisateur depuis getFavorite.php
var liste = [];

function getFavorites() {
    $.ajax({
        url: 'assets/php/getFavorite.php',
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            console.log("Favoris récupérés avec succès:", data);
            // Appeler une fonction pour récupérer les titres similaires pour chaque favori
            getSimilarTitlesForFavorites(data.favoris);
        },
        error: function(xhr, status, error) {
            console.error("Erreur lors de la récupération des favoris:", error);
        }
    });
}

// Fonction pour récupérer les titres similaires à partir de l'API TMDB pour chaque favori
function getSimilarTitlesForFavorites(favoris) {
    favoris.forEach(function(favori) {
        $.ajax({
            url: 'https://api.themoviedb.org/3/' + favori.id_type + '/' + favori.imdb_id + '/similar',
            type: 'GET',
            dataType: 'json',
            data: {
                api_key: '4bff542b068c0fff85589d72c363051d', 
                language: 'fr-FR', 
            },
            success: function(response) {
                // Traitement des résultats de l'API TMDB
                console.log("Titres similaires pour", favori.imdb_id + ':', response);
                // Parcourir les résultats de l'API et ajouter les durées aux titres
                response.results.forEach(function(titre) {
                    // Récupérer les détails du titre pour obtenir la durée
                    $.ajax({
                        url: 'https://api.themoviedb.org/3/' + favori.id_type + '/' + titre.id,
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            api_key: '4bff542b068c0fff85589d72c363051d',
                            language: 'fr-FR',
                        },
                        success: function(details) {
                            // Ajouter la durée au titre
                            titre.duration = details.runtime || (details.episode_run_time ? details.episode_run_time[0] : 0); // Durée en minutes
                            // Si c'est une série ou un anime, ajouter au moins un épisode
                            if (favori.id_type === 'tv') {
                                inclureEpisodeSerie(titre);
                            }
                            // Ajouter le titre à la liste
                            liste.push(titre);
                            console.log(liste);
                        },
                        error: function(xhr, status, error) {
                            console.error("Erreur lors de la récupération des détails du titre:", error);
                        }
                    });
                });
            },
            error: function(xhr, status, error) {
                console.error("Erreur lors de la récupération des titres similaires pour", favori.imdb_id + ':', error);
            }
        });
    });
}

// Fonction pour inclure au moins un épisode de série ou anime
function inclureEpisodeSerie(serie) {
    $.ajax({
        url: 'https://api.themoviedb.org/3/tv/' + serie.id + '/season/1',
        type: 'GET',
        dataType: 'json',
        data: {
            api_key: '4bff542b068c0fff85589d72c363051d',
            language: 'fr-FR',
        },
        success: function(season) {
            // Ajouter le premier épisode de la première saison à la liste
            if (season.episodes.length > 0) {
                var premierEpisode = season.episodes[0];
                premierEpisode.title = serie.title + ' - ' + premierEpisode.name;
                premierEpisode.duration = premierEpisode.runtime;
                liste.push(premierEpisode);
                console.log(liste);
            }
        },
        error: function(xhr, status, error) {
            console.error("Erreur lors de la récupération des épisodes de la série:", error);
        }
    });
}

// Appeler la fonction pour récupérer les favoris au chargement de la page
$(document).ready(function() {
    getFavorites();
});
