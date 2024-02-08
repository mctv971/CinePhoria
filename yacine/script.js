const apiBaseUrl = "https://api.themoviedb.org/3";
const apiKey = "665e5d9951a7b784e6d00cf978e8b72c";
const imageBaseUrl = "https://image.tmdb.org/t/p/w300";

const moviesGrid = document.getElementById("movies-grid");
const searchInput = document.getElementById("search-input");
const searchForm = document.getElementById("search-form");
const categoryTitle = document.getElementById("category-title");

// Appel de la fonction pour afficher les dernières sorties au chargement de la page
fetchLatestReleases();

async function fetchLatestReleases() {
    try {
        const moviesResponse = await fetch(`${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`);
        const showsResponse = await fetch(`${apiBaseUrl}/tv/on_the_air?api_key=${apiKey}`);

        const [moviesJsonResponse, showsJsonResponse] = await Promise.all([
            moviesResponse.json(),
            showsResponse.json(),
        ]);

        const movies = await Promise.all(
            moviesJsonResponse.results.map(async (result) => await processResult(result, 'movie'))
        );

        const shows = await Promise.all(
            showsJsonResponse.results.map(async (result) => await processResult(result, 'tv'))
        );

        const combinedResults = movies.concat(shows);

        // Affichage des résultats
        displayMoviesAndShows(combinedResults);
    } catch (error) {
        console.error('Erreur lors de la récupération des dernières sorties :', error);
    }
}

async function processResult(result, mediaType) {
    const IMDbId = await getIMDbId(result.id, mediaType);
    const isFavorite = await checkIfFavorite(result.id, IMDbId);

    return {
        id: result.id,
        title: result.title || result.name,
        poster_path: result.poster_path,
        vote_average: result.vote_average,
        IMDbId: IMDbId,
        media_type: mediaType,
        isFavorite: isFavorite,
    };
}

function displayMoviesAndShows(results) {
    moviesGrid.innerHTML = results
        .map(
            (result) =>
                `<div class="movie-card">
                        <img src="${imageBaseUrl}${result.poster_path}"/>
                        <p>⭐${result.vote_average}</p>
                        <h1>${result.title}</h1>
                        <button onclick="handleFavoriteButtonClick('${result.id}', '${result.title}', '${result.poster_path}', '${result.vote_average}', '${result.IMDbId}', '${result.media_type}', ${result.isFavorite})">${result.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}</button>
                 </div>`
        )
        .join("");
}

async function checkIfFavorite(id, IMDbId) {
    try {
        const response = await fetch('checkIfFavorite.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,
                imdb_id: IMDbId,
            }),
        });

        const result = await response.json();
        console.log('CheckIfFavorite result:', result);

        return result.isFavorite;
    } catch (error) {
        console.error('Erreur lors de la requête fetch :', error);
        return false;
    }
}

async function handleFavoriteButtonClick(id, title, poster_path, vote_average, IMDbId, media_type, isFavorite) {
    try {
        if (isFavorite) {
            // Retirer des favoris
            await removeFromFavorites(id, IMDbId);
        } else {
            // Ajouter aux favoris
            await addToFavorites(id, IMDbId, media_type);
        }

        // Mettre à jour l'affichage
        fetchLatestReleases();
    } catch (error) {
        console.error('Erreur lors de la gestion des favoris :', error);
        alert('Erreur lors de la gestion des favoris.');
    }
}



async function addToFavorites(id, IMDbId, media_type) {
    try {
        console.log('Data sent to server:', JSON.stringify({
            id_type: media_type === 'movie' ? 'movie' : 'tv',
            imdb_id: IMDbId,
        }));
        const response = await fetch('addToFavorites.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_type: media_type === 'movie' ? 'movie' : 'tv',
                imdb_id: IMDbId,
            }),
        });

        const result = await response.json();

        if (result.success) {
            alert('Ajouté aux favoris avec succès!');
        } else {
            alert('Erreur lors de l\'ajout aux favoris.');
        }
    } catch (error) {
        console.error('Erreur lors de la requête fetch :', error);
        alert('Erreur lors de la requête fetch.');
    }
}

async function getIMDbId(movieId, type) {
    try {
        const response = await fetch(`${apiBaseUrl}/${type}/${movieId}/external_ids?api_key=${apiKey}`);
        const jsonResponse = await response.json();
        const IMDbId = jsonResponse.imdb_id;
        return IMDbId;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID IMDb :', error);
        return null;
    }
}
async function removeFromFavorites(id, IMDbId) {
    try {
        const response = await fetch('removeFromFavorites.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,
                imdb_id: IMDbId,
            }),
        });

        const result = await response.json();

        if (result.success) {
            alert('Retiré des favoris avec succès!');
        } else {
            alert('Erreur lors de la suppression des favoris.');
        }
    } catch (error) {
        console.error('Erreur lors de la requête fetch :', error);
        alert('Erreur lors de la requête fetch.');
    }
}
async function searchMovies(query) {
    try {
        const response = await fetch(`${apiBaseUrl}/search/multi?api_key=${apiKey}&query=${query}`);
        const jsonResponse = await response.json();
        
        const searchResults = await Promise.all(
            jsonResponse.results.map(async (result) => {
                const type = result.media_type || 'movie'; // Utilisez 'movie' par défaut si le type n'est pas défini
                return await processResult(result, type);
            })
        );

        // Affichage des résultats de la recherche
        displayMoviesAndShows(searchResults);
    } catch (error) {
        console.error('Erreur lors de la recherche de films par nom :', error);
    }
}
async function fetchMoviesAndTVShowsByGenre(genreId, mediaType) {
    try {
        const response = await fetch(`${apiBaseUrl}/discover/${mediaType}?api_key=${apiKey}&with_genres=${genreId}`);
        const jsonResponse = await response.json();

        const genreResults = await Promise.all(
            jsonResponse.results.map(async (result) => await processResult(result, mediaType))
        );

        // Affichage des résultats du genre
        displayMoviesAndShows(genreResults);
        categoryTitle.innerHTML = "Résultats par Genre";
    } catch (error) {
        console.error('Erreur lors de la récupération des résultats par genre :', error);
    }
}

async function searchMoviesByGenreAndName(genreId, mediaType, query) {
    try {
        const response = await fetch(`${apiBaseUrl}/search/multi?api_key=${apiKey}&query=${query}`);
        const jsonResponse = await response.json();

        const searchResults = await Promise.all(
            jsonResponse.results.map(async (result) => {
                const type = result.media_type || 'movie';
                return await processResult(result, type);
            })
        );

        // Filtrer les résultats par genre
        const genreFilteredResults = searchResults.filter(result => result.media_type === mediaType);

        // Affichage des résultats de la recherche par genre
        displayMoviesAndShows(genreFilteredResults);
        categoryTitle.innerHTML = `Résultats de recherche pour "${query}" dans la catégorie "${mediaType === 'movie' ? 'Film' : 'Série TV'}"`;
    } catch (error) {
        console.error('Erreur lors de la recherche de films par nom et genre :', error);
    }
}
// Ajoutez cette fonction dans votre fichier script.js
function handleGenreAndMediaTypeChange() {
    const selectedGenre = document.getElementById("genre-select").value;
    const selectedMediaType = document.getElementById("media-type-select").value;

    if (selectedGenre || selectedMediaType) {
        fetchMoviesAndTVShowsByGenre(selectedGenre, selectedMediaType);
    } else {
        fetchLatestReleases();
    }
}

function handleSearchFormSubmit(event) {
    event.preventDefault();
    const searchQuery = searchInput.value;
    
    const selectedGenre = document.getElementById("genre-select").value;
    const selectedMediaType = document.getElementById("media-type-select").value;

    if (selectedGenre) {
        // Recherche par genre
        fetchMoviesAndTVShowsByGenre(selectedGenre, selectedMediaType);
    } else if (searchQuery.trim() !== "") {
        // Recherche par nom
        searchMoviesByGenreAndName(selectedGenre, selectedMediaType, searchQuery);
    } else {
        // Si le champ de recherche est vide et aucun genre n'est sélectionné, affichez les dernières sorties
        fetchLatestReleases();
    }
}
searchForm.addEventListener("submit", handleSearchFormSubmit);
fetchMoviesNowPlaying();