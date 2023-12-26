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
    // Requête pour récupérer les dernières sorties de films
    const moviesResponse = await fetch(`${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`);
    const moviesJsonResponse = await moviesResponse.json();
    
    // Requête pour récupérer les dernières sorties de séries TV
    const showsResponse = await fetch(`${apiBaseUrl}/tv/on_the_air?api_key=${apiKey}`);
    const showsJsonResponse = await showsResponse.json();

    // Traitement des résultats
    const movies = await Promise.all(
        moviesJsonResponse.results.map(async (result) => ({
            id: result.id,
            title: result.title,
            poster_path: result.poster_path,
            vote_average: result.vote_average,
            IMDbId: await getIMDbId(result.id, "movie"),
        }))
    );

    const shows = await Promise.all(
        showsJsonResponse.results.map(async (result) => ({
            id: result.id,
            name: result.name,
            poster_path: result.poster_path,
            vote_average: result.vote_average,
            IMDbId: await getIMDbId(result.id, "tv"),
        }))
    );

    // Combinaison des résultats
    const combinedResults = movies.concat(shows);

    // Affichage des résultats
    displayMoviesAndShows(combinedResults);
}

function displayMoviesAndShows(results) {
    moviesGrid.innerHTML = results
        .map(
            (result) =>
                `<div class="movie-card">
                    <a href="https://www.imdb.com/title/${result.IMDbId}/">
                        <img src="${imageBaseUrl}${result.poster_path}"/>
                        <p>⭐${result.vote_average}</p>
                        <h1>${result.title || result.name}<h1/>
                    </a>
                 </div>`
        )
        .join("");
}

async function handleSearchFormSubmit(event) {
    event.preventDefault();
    categoryTitle.innerHTML = "Résultat :";
    const searchQuery = searchInput.value;
    await fetchMoviesAndTVShows(searchQuery);
}

async function getIMDbId(movieId, type) {
    const response = await fetch(`${apiBaseUrl}/${type}/${movieId}/external_ids?api_key=${apiKey}`);
    const jsonResponse = await response.json();
    const IMDbId = jsonResponse.imdb_id;
    return IMDbId;
}
async function fetchMoviesAndTVShows(query) {
    const moviesResponse = await fetch(`${apiBaseUrl}/search/movie?api_key=${apiKey}&query=${query}`);
    const moviesJsonResponse = await moviesResponse.json();

    const showsResponse = await fetch(`${apiBaseUrl}/search/tv?api_key=${apiKey}&query=${query}`);
    const showsJsonResponse = await showsResponse.json();

    const movies = await Promise.all(
        moviesJsonResponse.results.map(async (result) => ({
            id: result.id,
            title: result.title,
            poster_path: result.poster_path,
            vote_average: result.vote_average,
            IMDbId: await getIMDbId(result.id, "movie"),
        }))
    );

    const shows = await Promise.all(
        showsJsonResponse.results.map(async (result) => ({
            id: result.id,
            name: result.name,
            poster_path: result.poster_path,
            vote_average: result.vote_average,
            IMDbId: await getIMDbId(result.id, "tv"),
        }))
    );

    const combinedResults = movies.concat(shows);

    displayMoviesAndShows(combinedResults);
}

searchForm.addEventListener("submit", handleSearchFormSubmit);

// Reste du code inchangé...

searchForm.addEventListener("submit", handleSearchFormSubmit);
