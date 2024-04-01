'use strict';

import { fetchDataFromServer } from "./api.js";
import { createMovieCardAna, createPeopleCardAna, createTvCardAna } from "./movie-card.js";
const api_key = "4bff542b068c0fff85589d72c363051d";


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
  });

  const searchResultModal = document.querySelector(".slider-inner");

  let searchTimeout;

  searchField.addEventListener("input", function () {
    if (!searchField.value.trim()) {
      searchWrapper.classList.remove("searching");
      clearTimeout(searchTimeout);
      return;
    }

    searchWrapper.classList.add("searching");
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(function () {
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
        searchResultModal.innerHTML = ""; // remove old results



        for (const item of searchResults) {
          let card;
          if (mode === 'movie') {
            card = createMovieCardAna(item);
          } else if (mode === 'person') {
            card = createPeopleCardAna(item);
          } else if (mode === 'tv') {
            card = createTvCardAna(item);
          }

          searchResultModal.appendChild(card);
        }
      });
    }, 500);
  });
}

