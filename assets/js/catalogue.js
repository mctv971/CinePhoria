'use strict';

/**
 * import all components and functions
 */

import { sidebar } from "./sidebar.js";
import { fetchAPIKeys, imageBaseURL, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";
import { popcorn } from "./popcorn.js";

let api_key;
const pageContent = document.querySelector("[page-content]");

sidebar();
fetchAPIKeys().then(keys => {
  api_key = keys;
  initializePage(); // Initialise la page une fois que les clés sont disponibles
});
/**
 * fetch all genres eg: [ { "id": "123", "name": "Action" } ]
 * then change genre format eg: { 123: "Action" }
 */
const initializePage = () => {
const genreList = {

  // create genre string from genre_id eg: [23, 43] -> "Action, Romance".
  asString(genreIdList) {
    let newGenreList = [];
  
    for (const genreId of genreIdList) {
      this[genreId] && newGenreList.push(this[genreId]); // this == genreList;
    }
  
    return newGenreList.join(", ");
  }

};

fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, function ({ genres }) {
  for (const { id, name } of genres) {
    genreList[id] = name;
  }

  // Display a section for each genre
  displayGenreSections();
});

const displayGenreSections = function () {
  for (const genreId in genreList) {
    const genreName = genreList[genreId];

    // Vérifier si genreId est une clé propre de l'objet genreList
    if (genreList.hasOwnProperty(genreId)) {
      fetchDataFromServer(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&with_genres=${genreId}&page=1`, createMovieList, genreName);
    }
  }
}
const genreColors = {
  Action: 'linear-gradient(to right, rgba(239, 115, 0, 1), rgba(250, 240, 3, 0.53))',
  Adventure: 'linear-gradient(to right, #1e5799, #2989d8)',
  Fantasy: 'linear-gradient(to right, #6a3093, #a044ff)',
  Animation: 'linear-gradient(to right, #00bfff, #87ceeb)',
  Drama: 'linear-gradient(to right, #ff6347, #d00000)',
  Horror: 'linear-gradient(to right, #800000, #ff0000)',
  Comedy: 'linear-gradient(to right, #32cd32, #228b22)',
  History: 'linear-gradient(to right, #8b4513, #cd853f)',
  Western: 'linear-gradient(to right, #deb887, #a0522d)',
  Thriller: 'linear-gradient(to right, #483d8b, #9370db)',
  Crime: 'linear-gradient(to right, #2f4f4f, #008080)',
  Documentary: 'linear-gradient(to right, #008000, #32cd32)',
  ScienceFiction: 'linear-gradient(to right, #000080, #4682b4)',
  Mystery: 'linear-gradient(to right, #4b0082, #800080)',
  Music: 'linear-gradient(to right, #9932cc, #8a2be2)',
  Romance: 'linear-gradient(to right, #ff69b4, #ff1493)',
  Family: 'linear-gradient(to right, #daa520, #ffd700)',
  War: 'linear-gradient(to right, #b22222, #cd5c5c)',
  TVMovie: 'linear-gradient(to right, #ffc0cb, #ffb6c1)'
};
  

const createMovieList = function ({ results: movieList }, title) {
  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list");
  movieListElem.ariaLabel = `${title}`;

  const genreColor =genreColors[title] || 'linear-gradient(to right, #ff0000, #0000ff)';

  movieListElem.innerHTML = `
    <div class="title-wrapper">
      <h3 class="title-large">${title}</h3>
    </div>
    
    <div class="slider-list" style="background: ${genreColor}";>
      <div class="slider-inner"></div>
    </div>
  `;

  for (const movie of movieList) {
    const movieCard = createMovieCard(movie); // called from movie_card.js
    movieListElem.querySelector(".slider-inner").appendChild(movieCard);
  }

  pageContent.appendChild(movieListElem);
}


window.addEventListener('message', function(event) {
  // Vérifie si le message reçu est celui indiquant que le contenu de l'iframe a été modifié
  if (event.data === 'contenuModifie') {
      // Actualise l'iframe en rechargeant son contenu
      document.getElementById('iframe').contentWindow.location.reload();
  }
}, false);

window.onload = clearLocalStorageIfIframeNotActive;


closeIframe();
search();
popcorn();
}