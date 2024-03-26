'use strict';
let api_key, chatgpt_key, imdb_key;

const imageBaseURL = 'https://image.tmdb.org/t/p/';


/**
 * fetch data from a server using the `url` and passes
 * the result in JSON data to a `callback` function,
 * along with an optional parameter if has `optionalParam`.
 */
const fetchDataFromServer = function (url, callback, optionalParam) {
  fetch(url)
    .then(response => response.json())
    .then(data => callback(data, optionalParam));
}

// Récupérer les clés API depuis le serveur
fetch('assets/php/get_key.php')
  .then(response => response.json())
  .then(data => {
    // Assigner les clés API aux variables
    chatgpt_key = data.chatgpt_key;
    api_key = data.tmdb_key;
    imdb_key = data.imdb_key;
    
  });

// Récupérer les clés API depuis le serveur
const fetchAPIKeys = () => {
  return fetch('assets/php/get_key.php')
    .then(response => response.json())
    .then(data => {
      // Assigner les clés API aux variables
      chatgpt_key = data.chatgpt_key;
      api_key = data.tmdb_key;
      imdb_key = data.imdb_key;
      return api_key; // Retourner les clés API
    });
}

export { imageBaseURL, fetchDataFromServer, api_key, fetchAPIKeys };
