const axios = require('axios');
const fs = require('fs');

const api_key = "4bff542b068c0fff85589d72c363051d";

function getFavorites(id_type) {
    return getFavoritesByType(id_type)
        .then(data => {
            if (data.length === 0) {
                console.log(`Aucun favori trouvé pour le type ${id_type}. Passer à l'élément suivant.`);
                return []; // Retourner un tableau vide si aucun favori n'est trouvé
            }
            return fetchFavoriteData(data, path);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des favoris par type :', error);
            return []; // Retourner un tableau vide en cas d'erreur
        });
}

function getSimilarMovies(movieId) {
    return axios.get(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${api_key}`)
        .then(response => response.data.results);
}

function createBouquet(id_type) {
    getFavorites(id_type).then(favorites => {
        const bouquet = [];

        favorites.forEach(favorite => {
            getSimilarMovies(favorite.id).then(similarMovies => {
                bouquet.push(...similarMovies);
            });
        });

        // Écrivez le bouquet dans un fichier
        fs.writeFileSync('bouquet.json', JSON.stringify(bouquet));
    });
}

createBouquet("movie","tv"); 