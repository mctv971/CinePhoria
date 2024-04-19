// Fonction pour créer des bouquets en fonction de la durée avec une combinaison de films et d'épisodes de série
function creerBouquets(titresSimilaires) {
    var bouquets = {
        '3h': [],
        '8h': [],
        '24h': []
    };

    var dureeRestante = {
        '3h': 180, // 3h en minutes
        '8h': 480, // 8h en minutes
        '24h': 1440 // 24h en minutes
    };

    // Parcourir les titres similaires et les ajouter aux bouquets appropriés
    titresSimilaires.forEach(function(titre) {
        // Vérifier si le titre est un film ou une série
        if (titre.media_type === 'movie') {
            // Ajouter le film au bouquet correspondant en fonction de la durée restante
            if (dureeRestante['3h'] >= titre.duration && bouquets['3h'].length < 3) {
                bouquets['3h'].push(titre);
                dureeRestante['3h'] -= titre.duration;
            } else if (dureeRestante['8h'] >= titre.duration && bouquets['8h'].length < 8) {
                bouquets['8h'].push(titre);
                dureeRestante['8h'] -= titre.duration;
            } else if (dureeRestante['24h'] >= titre.duration && bouquets['24h'].length < 24) {
                bouquets['24h'].push(titre);
                dureeRestante['24h'] -= titre.duration;
            }
        } else if (titre.media_type === 'tv') {
            // Ajouter un épisode de série au bouquet correspondant en fonction de la durée restante
            if (dureeRestante['3h'] >= titre.duration && bouquets['3h'].length < 3) {
                bouquets['3h'].push(titre);
                dureeRestante['3h'] -= titre.duration;
            } else if (dureeRestante['8h'] >= titre.duration && bouquets['8h'].length < 8) {
                bouquets['8h'].push(titre);
                dureeRestante['8h'] -= titre.duration;
            } else if (dureeRestante['24h'] >= titre.duration && bouquets['24h'].length < 24) {
                bouquets['24h'].push(titre);
                dureeRestante['24h'] -= titre.duration;
            }
        }
    });

    return bouquets;
}
// Fonction pour mélanger un tableau
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
            getSimilarTitlesForFavorites(data.favoris.slice(0, 3)); // Limiter à trois favoris pour cette démonstration
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
                // Créer les bouquets en fonction des titres similaires
                var bouquets = creerBouquets(response.results);
                // Afficher les bouquets
                afficherBouquets(bouquets);
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
async function creerBouquetAutomatique(favoris, dureeSouhaitee) {
    let bouquet = [];
    let dureeRestante = dureeSouhaitee * 60; // Convertir en minutes

    for (let favori of favoris) {
        let similaires = await getSimilarTitles(favori.id, favori.type); // Récupérer des titres similaires
        // Trier les titres similaires par durée, du plus court au plus long
        similaires.sort((a, b) => a.duration - b.duration);

        for (let similaire of similaires) {
            let duration = await getDuration(similaire.id, similaire.type); // Récupérer la durée du titre
            if (dureeRestante >= duration) {
                bouquet.push(similaire);
                dureeRestante -= duration;
            }
            if (dureeRestante <= 0) break;
        }
        if (dureeRestante <= 0) break;
    }

    return bouquet;
}


function creerBouquetAleatoire(favoris, tempsDisponible) { // Bouquet de recommendation aléatoires
    let bouquet = [];
    let dureeRestante = tempsDisponible * 60; // Convertir en minutes
    let titresMelanges = shuffleArray(favoris); // Mélanger les favoris pour un choix aléatoire

    titresMelanges.some(favori => {
        if (dureeRestante >= favori.duree) {
            bouquet.push(favori);
            dureeRestante -= favori.duree;
        }
        return dureeRestante <= 0;
    });

    return bouquet;
}


function creerBouquetPersonnalise(favoris, heuresChoisies) { // Bouquet créé par l'utilisateur
    let bouquet = [];
    let dureeTotale = heuresChoisies * 60; // Convertir en minutes

    favoris.forEach(favori => {
        if (dureeTotale >= favori.duree) {
            bouquet.push(favori);
            dureeTotale -= favori.duree;
        }
    });
    return bouquet;
}










// Appeler la fonction pour récupérer les favoris au chargement de la page
$(document).ready(function() {

    $('#generatePosterButton').click(function() {
        $.ajax({
            type: "POST",
            url: "Poster/ton_serveur.php",  // Assurez-vous que cette URL est correcte
            data: {generatePoster: true},
            dataType: "json",
            success: function(response) {
                if(response && response.url) {
                    $('#imageContainer').empty();  // Efface les images précédentes
                    $('#imageContainer').append('<img src="' + response.url + '" alt="Poster de film";">');
                }
            },
            error: function() {
                alert("Erreur lors de la génération des images.");
            }
        });
    });

    $('.quizzBtn').click(function() {
        $('#iframe').attr('src', 'quizzgpt.php?reset=true');       
        $('.backgroundOverlay').addClass('active');
        $('.iframeContainer').addClass('active');
        $('.closeIcon').addClass('active');

    });
    $('.closeIcon').click(function() {
        $('#iframe').attr('src', '');       
        $('.backgroundOverlay').removeClass('active');
        $('.iframeContainer').removeClass('active');
        $('.closeIcon').removeClass('active');
    });


});
