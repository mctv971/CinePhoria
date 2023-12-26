const apiBaseUrl = "https://api.themoviedb.org/3";
const apiKey = "665e5d9951a7b784e6d00cf978e8b72c";
const imageBaseUrl = "https://image.tmdb.org/t/p/w300";

const moviesGrid = document.getElementById("movies-grid");
const searchInput = document.getElementById("search-input");
const searchForm = document.getElementById("search-form");
const categoryTitle = document.getElementById("category-title");

async function fetchMoviesNowPlaying() {
    const response = await fetch(`${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`);
    const jsonResponse = await response.json();
    const movies = await Promise.all(
        jsonResponse.results.map(async (result) => ({
            id: result.id,
            title: result.title,
            poster_path: result.poster_path,
            vote_average: result.vote_average,
            IMDbId: await getIMDbId(result.id),
        }))
    );
    displayMovies(movies);
}

async function searchMovies(query) {
    const response = await fetch(`${apiBaseUrl}/search/movie?api_key=${apiKey}&query=${query}`);
    const jsonResponse = await response.json();
    const movies = await Promise.all(
        jsonResponse.results.map(async (result) => ({
            id: result.id,
            title: result.title,
            poster_path: result.poster_path,
            vote_average: result.vote_average,
            IMDbId: await getIMDbId(result.id),
        }))
    );
    displayMovies(movies);
}

function displayMovies(movies) {
    moviesGrid.innerHTML = movies
        .map(
            (movie) =>
                `<div class="movie-card">
                    <a href="https://www.imdb.com/title/${movie.IMDbId}/">
                        <img src="${imageBaseUrl}${movie.poster_path}"/>
                        <p>⭐${movie.vote_average}</p>
                        <h1>${movie.title}<h1/>
                    </a>
                 </div>`
                 //MODIFIER LE HREF POUR ALLER SUR LA PAGE FILM 
        )
        .join("");
}

function handleSearchFormSubmit(event) {
    event.preventDefault();
    categoryTitle.innerHTML = "Search Results";
    const searchQuery = searchInput.value;
    searchMovies(searchQuery);
}

async function getIMDbId(movieId) {
    const response = await fetch(`${apiBaseUrl}/movie/${movieId}/external_ids?api_key=${apiKey}`);
    const jsonResponse = await response.json();
    const IMDbId = jsonResponse.imdb_id;
    return IMDbId;
}

searchForm.addEventListener("submit", handleSearchFormSubmit);
fetchMoviesNowPlaying();