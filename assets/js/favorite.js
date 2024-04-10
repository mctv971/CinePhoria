'use strict';

/**
 * import all components and functions
 */

import { sidebar } from "./sidebar.js";
import { imageBaseURL, fetchDataFromServer } from "./api.js";
import { createMovieCard, createAnimCard, createPeopleCard, createTvCard } from "./movie-card.js";
import { search } from "./search.js";

const api_key = "4bff542b068c0fff85589d72c363051d";


const pageContent = document.querySelector("[page-content]");
sidebar();


const favoritePageSections = [

    {
      title: "Movies",
      path: "movie",
      id_type: "movie",
      createCardFunction: createMovieCard
    },
    {
      title: "TV Shows",
      path: "tv",
      id_type: "tv",
      createCardFunction: createTvCard
    },
  
    {
      title: "People",
      path: "person",
      id_type: "people",
      createCardFunction: createPeopleCard
    }
    
  
  ];



  for (const { title, path, id_type, createCardFunction } of favoritePageSections) {
    getFavoritesByType(id_type)
    .then(data => {
        // Vérifier si la liste retournée est vide
        if (data.length === 0) {
            console.log(`Aucun favori trouvé pour le type ${id_type}. Passer à l'élément suivant.`);
            return; // Passer à l'élément suivant de favoritePageSections
        }
        fetchFavoriteData(data, path)
            .then(favoriteData => {
                createContentSection(favoriteData, title, createCardFunction);
            })
            .catch(error => console.error('Erreur lors de la récupération des données des favoris sur TMDB :', error));
    })
    .catch(error => console.error('Erreur lors de la récupération des favoris par type :', error));
}





const createContentSection = function ( itemList , title, createCardFunction) {
    const section = document.createElement("section");
    section.classList.add("movie-list");
    section.setAttribute("aria-label", title);
  
    section.innerHTML = `
      <div class="title-wrapper">
        <h3 class="title-large">${title}</h3>
      </div>
      
      <div class="slider-list">
        <div class="slider-inner"></div>
      </div>
    `;
  
    const sliderInner = section.querySelector(".slider-inner");
  
    for (const item of itemList) {
      const card = createCardFunction(item);
      sliderInner.appendChild(card);
    }
  
    pageContent.appendChild(section);
}
// Fonction pour récupérer tous les favoris par rapport à un type spécifié
function getFavoritesByType(idType) {
    // Créer un objet contenant les données à envoyer
    const data = {
        id_type: idType
    };

    // Envoyer une requête AJAX pour récupérer les favoris par type
    return fetch('assets/php/getFavoritesByType.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Si la récupération des favoris réussit, vous pouvez effectuer des actions supplémentaires si nécessaire
            console.log('Favoris récupérés avec succès :', data.favoris);
            return data.favoris;
        } else {
            // Si la récupération des favoris échoue, vous pouvez gérer l'erreur ici
            console.error('Erreur lors de la récupération des favoris :', data.message);
            return [];
        }
    })
    .catch(error => {
        console.error('Erreur lors de l\'envoi de la requête AJAX :', error);
        return [];
    });
}
// Fonction pour traiter la liste des favoris et récupérer les données de tous les éléments sur TMDB
// Fonction pour traiter la liste des favoris et récupérer les données de tous les éléments sur TMDB
// Définition de la fonction fetchDataFromServer
async function fetchDataFromServerFavorite(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Utilisation de fetchDataFromServer dans fetchFavoriteData
async function fetchFavoriteData(favoritesList, path) {
    // Liste pour stocker les données de chaque favori
    const dataResults = [];

    // Parcourir les valeurs de l'objet favoritesList
    for (const favorite of Object.values(favoritesList)) {
        // Construire l'URL pour récupérer les données du favori sur TMDB
        const tmdbUrl = `https://api.themoviedb.org/3/${path}/${favorite.imdb_id}?api_key=${api_key}`;

        try {
            // Attendre que les données du favori soient récupérées
            const data = await fetchDataFromServerFavorite(tmdbUrl);
            console.log("data : ", data)
            // Ajouter les données à la liste des résultats
            dataResults.push(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données du favori sur TMDB :', error);
        }
    }

    // Retourner la liste complète des données
    return dataResults;
}





window.onload = clearLocalStorageIfIframeNotActive;




closeIframe();
search();
