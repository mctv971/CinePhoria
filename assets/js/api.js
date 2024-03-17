'use strict';

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
fetch('../php/get_key.php')
  .then(response => response.json())
  .then(data => {
    // Assigner les clés API aux variables
    const chatgpt_key = data.chatgpt_key;
    const api_key = data.tmdb_key;
    const imdb_key = data.imdb_key;
    
  });

export { imageBaseURL, fetchDataFromServer };
