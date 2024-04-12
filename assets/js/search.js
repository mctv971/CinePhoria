'use strict';


import { fetchAPIKeys, imageBaseURL, fetchDataFromServer } from "./api.js";
import { createMovieCard, createPeopleCard, createTvCard } from "./movie-card.js";

let api_key

fetchAPIKeys().then(keys => {
  api_key = keys;
  initializePage(); // Initialise la page une fois que les clés sont disponibles
});

const initializePage = () => {
  search();
};

export function search() {
  const searchWrapper = document.querySelector("[search-wrapper]");
  const searchField = document.querySelector("[search-field]");
  const modeSwitchIcon = document.querySelector(".leading-icon2");

  let mode = 'movie'; // Par défaut, le mode de recherche est pour les films

  modeSwitchIcon.addEventListener('click', function() {
    // Changer le mode de recherche et l'icône en conséquence
    if (mode === 'movie') {
      mode = 'person';
      modeSwitchIcon.src = './assets/images/logo-profil.png';
      searchField.placeholder = 'Search any people...';
      

    } else if (mode === 'person') {
      mode = 'tv';
      modeSwitchIcon.src = './assets/images/tv-show.png';
      searchField.placeholder = 'Search any Tv Shows...';
      

    } else if (mode === 'tv') {
      mode = 'movie';
      modeSwitchIcon.src = './assets/images/play_circle.png';
      searchField.placeholder = 'Search any movies...';
      

    }
    if (!searchField.value.trim()) {
      searchResultModal.classList.remove("active");
      searchWrapper.classList.remove("searching");
      clearTimeout(searchTimeout);
      return;
    }

    searchWrapper.classList.add("searching");
    clearTimeout(searchTimeout);



    searchTimeout = setTimeout(recherche, 500);
  

  });

  const searchResultModal = document.createElement("div");
  searchResultModal.classList.add("search-modal");
  document.querySelector("main").appendChild(searchResultModal);

  let searchTimeout;

  const recherche = function () {
    let apiUrl;
    if (mode === 'movie') {
      apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${searchField.value}&page=1&include_adult=false`;
    } else if (mode === 'person') {
      apiUrl = `https://api.themoviedb.org/3/search/person?api_key=${api_key}&query=${searchField.value}&page=1&include_adult=false`;
    } else if (mode === 'tv') {
      apiUrl = `https://api.themoviedb.org/3/search/tv?api_key=${api_key}&query=${searchField.value}&page=1&include_adult=false`;
    }

    fetchDataFromServer(apiUrl, function ({ results: searchResults }) {
      searchWrapper.classList.remove("searching");
      searchResultModal.classList.add("active");
      searchResultModal.innerHTML = ""; // remove old results

      searchResultModal.innerHTML = `
        <p class="label">Results for</p>
        
        <h1 class="heading">${searchField.value}</h1>
        
        <div class="result-list">
          <div class="grid-list"></div>
        </div>
      `;

      for (const item of searchResults) {
        let card;
        if (mode === 'movie') {
          card = createMovieCard(item);
        } else if (mode === 'person') {
          card = createPeopleCard(item);
        } else if (mode === 'tv') {
          card = createTvCard(item);
        }

        searchResultModal.querySelector(".grid-list").appendChild(card);
      }
    });
  };

  searchField.addEventListener("input", function () {
    if (!searchField.value.trim()) {
      searchResultModal.classList.remove("active");
      searchWrapper.classList.remove("searching");
      clearTimeout(searchTimeout);
      return;
    }

    searchWrapper.classList.add("searching");
    clearTimeout(searchTimeout);



    searchTimeout = setTimeout(recherche, 500);
  });
}

