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
                api_key: '4bff542b068c0fff85589d72c363051d', // Remplacez 'API_KEY' par votre clé API TMDB
                language: 'fr-FR', // Langue des résultats
                page: 1 // Page de résultats (vous pouvez utiliser la pagination si nécessaire)
            },
            success: function(response) {
                // Traitement des résultats de l'API TMDB
                console.log("Titres similaires pour", favori.imdb_id + ':', response);
                liste.push(response.results);
                console.log(liste);
                // Vous pouvez maintenant manipuler les titres similaires et construire vos bouquets
            },
            error: function(xhr, status, error) {
                console.error("Erreur lors de la récupération des titres similaires pour", favori.imdb_id + ':', error);
            }
        });
    });
}



// Appeler la fonction pour récupérer les favoris au chargement de la page
$(document).ready(function() {
    getFavorites();
});
