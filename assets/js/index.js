'use strict';

/**
 * import all components and functions
 */

import { sidebar } from "./sidebar.js";
import { fetchAPIKeys, imageBaseURL, fetchDataFromServer } from "./api.js";
import { createMovieCard, createAnimCard, createPeopleCard, createTvCard, createMovieCardDicta, createTvCardDicta, createAnimCardDicta,createPeopleCardDicta, createMovieCardFavorite, createTvCardFavorite, createAnimCardFavorite,createPeopleCardFavorite } from "./movie-card.js";
import { search, searchDictaciel } from "./search.js";
import { popcorn } from "./popcorn.js";



let api_key;
const pageContent = document.querySelector("[page-content]");



sidebar();
fetchAPIKeys().then(keys => {
  api_key = keys;
  initializePage(); // Initialise la page une fois que les clés sont disponibles

});


const initializePage = () => {


  const homePageSections = [

    {
      title: "Movies",
      path: "/movie/popular",
      createCardFunction: createMovieCard
    },
    {
      title: "TV Shows",
      path: "/tv/popular",
      createCardFunction: createTvCard
    },
  
    {
      title: "Anime",
      path: "/discover/tv",
      queryParams: "with_genres=16",
      createCardFunction: createAnimCard
    },
    {
      title: "People",
      path: "/person/popular",
      createCardFunction: createPeopleCard
    }
    
  
  ];
  fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, function ({ genres }) {
  for (const { id, name } of genres) {
    genreList[id] = name;
  }

  fetchDataFromServer(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`, heroBanner);
  });

  /**
 * Home page sections (Top rated, Upcoming, Trending movies)
 */





  /**
 * fetch all genres eg: [ { "id": "123", "name": "Action" } ]
 * then change genre formate eg: { 123: "Action" }
 */
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




  const heroBanner = function ({ results: movieList }) {


    const banner = document.createElement("section");
    banner.classList.add("banner");
    banner.ariaLabel = "Popular Movies";

    banner.innerHTML = `
      <div class="banner-slider"></div>
      
      <div class="slider-control">
        <div class="control-inner"></div>
      </div>
    `;

    let controlItemIndex = 0;

    for (const [index, movie] of movieList.entries()) {

      const {
        backdrop_path,
        title,
        release_date,
        genre_ids,
        overview,
        poster_path,
        vote_average,
        id
      } = movie;

      const sliderItem = document.createElement("div");
      sliderItem.classList.add("slider-item");
      sliderItem.setAttribute("slider-item", "");

      sliderItem.innerHTML = `
        <img src="${imageBaseURL}w1280${backdrop_path}" alt="${title}" class="img-cover" loading=${index === 0 ? "eager" : "lazy"
        }>
        
        <div class="banner-content">
        
          <h2 class="heading">${title}</h2>
        
          <div class="meta-list">
            <div class="meta-item">${release_date?.split("-")[0] ?? "Not Released"}</div>
        
            <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
          </div>
        
          <p class="genre">${genreList.asString(genre_ids)}</p>
        
          <p class="banner-text">${overview}</p>
        
          <a class="btn" onclick="getMovieDetail(${id})">
            <img src="./assets/images/play_circle.png" width="24" height="24" aria-hidden="true" alt="play circle">
        
            <span class="span">Watch Now</span>
          </a>
        
        </div>
      `;
      banner.querySelector(".banner-slider").appendChild(sliderItem);


      const controlItem = document.createElement("button");
      controlItem.classList.add("poster-box", "slider-item");
      controlItem.setAttribute("slider-control", `${controlItemIndex}`);

      controlItemIndex++;

      controlItem.innerHTML = `
        <img src="${imageBaseURL}w154${poster_path}" alt="Slide to ${title}" loading="lazy" draggable="false" class="img-cover">
      `;
      banner.querySelector(".control-inner").appendChild(controlItem);

    }

    pageContent.appendChild(banner);

    addHeroSlide();


    /**
     * fetch data for home page sections (top rated, upcoming, trending)
     */
    for (const { title, path, createCardFunction, queryParams } of homePageSections) {
      fetchDataFromServer(`https://api.themoviedb.org/3${path}?api_key=${api_key}&page=1&${queryParams}`, function (data) {
        createContentSection(data, title, createCardFunction);
      });
    }

  }






  /**
   * Hero slider functionality
   */

  const addHeroSlide = function () {

    const sliderItems = document.querySelectorAll("[slider-item]");
    const sliderControls = document.querySelectorAll("[slider-control]");

    let lastSliderItem = sliderItems[0];
    let lastSliderControl = sliderControls[0];

    lastSliderItem.classList.add("active");
    lastSliderControl.classList.add("active");

    const sliderStart = function () {
      lastSliderItem.classList.remove("active");
      lastSliderControl.classList.remove("active");

      // `this` == slider-control
      sliderItems[Number(this.getAttribute("slider-control"))].classList.add("active");
      this.classList.add("active");

      lastSliderItem = sliderItems[Number(this.getAttribute("slider-control"))];
      lastSliderControl = this;
    }

    addEventOnElements(sliderControls, "click", sliderStart);

  }



  const createContentSection = function ({ results: itemList }, title, createCardFunction) {
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




};

const initializePageDictaciel = () => {
  const dictacielContent = document.querySelector(".dictaciel-main");


  const homePageSections = [

    {
      title: "Movies",
      path: "/movie/popular",
      createCardFunction: createMovieCardDicta
    },
    {
      title: "TV Shows",
      path: "/tv/popular",
      createCardFunction: createTvCardDicta
    },
  
    {
      title: "Anime",
      path: "/discover/tv",
      queryParams: "with_genres=16",
      createCardFunction: createAnimCardDicta
    },
    {
      title: "People",
      path: "/person/popular",
      createCardFunction: createPeopleCardDicta
    }
    
  
  ];
  fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, function ({ genres }) {
  for (const { id, name } of genres) {
    genreList[id] = name;
  }

  });

  /**
 * Home page sections (Top rated, Upcoming, Trending movies)
 */





/**
 * fetch all genres eg: [ { "id": "123", "name": "Action" } ]
 * then change genre formate eg: { 123: "Action" }
 */
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






  /**
   * fetch data for home page sections (top rated, upcoming, trending)
   */
  for (const { title, path, createCardFunction, queryParams } of homePageSections) {
    fetchDataFromServer(`https://api.themoviedb.org/3${path}?api_key=${api_key}&page=1&${queryParams}`, function (data) {
      createContentSectionDicta(data, title, createCardFunction);
    });
  }

  const createContentSectionDicta = function ({ results: itemList }, title, createCardFunction) {
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

      dictacielContent.appendChild(section);
  }

};












window.addEventListener('message', function(event) {
  // Vérifie si le message reçu est celui indiquant que le contenu de l'iframe a été modifié
  if (event.data === 'contenuModifie') {
      // Actualise l'iframe en rechargeant son contenu
      document.getElementById('iframe').contentWindow.location.reload();
  }
}, false);

window.onload = clearLocalStorageIfIframeNotActive;
window.openIframeFav = function() {
  const elements = {
    iframeFavorite: $('.dicta-list-favoris')
  };
  elements.iframeFavorite.addClass('active');


}


var favorites = [];


window.addFavoriteDicta = function(id,type){

    var isAlreadyAdded = favorites.some(function(item) {
      return item.id === id && item.type === type;
    });

    if (isAlreadyAdded) {
      alert("Cet élément est déjà dans les favoris !");
      return;
    }



  var countElement = document.querySelector('.dictaciel-like h1');
  var count = parseInt(countElement.innerText.slice(1, -1));
  if (count == 5){
    alert("Vous avez atteint le nombre maximum de favoris");
    return;
  }
  count++;
  countElement.innerText = '(' + count + ')';
  favorites.push({ id: id, type: type });
  if(count==5){
    openIframeFav();
  }

  createFavoritesCard(id, type);



  
}
window.deleteFavoriteDicta = function(id, type) {
  var cardFavoDivs = document.querySelectorAll(`.cardFavoDiv[data-id="${id}"][data-type="${type}"]`);
  cardFavoDivs.forEach(function(cardFavoDiv) {
    cardFavoDiv.remove();
    // Mettre à jour l'affichage des favoris ici si nécessaire
    console.log("Élément supprimé des favoris :", id, type);
  });

  var indexToRemove = -1;
  for (var i = 0; i < favorites.length; i++) {
    if (favorites[i].id === id && favorites[i].type === type) {
      indexToRemove = i;
      break;
    }
  }
  var countElement = document.querySelector('.dictaciel-like h1');
  var count = parseInt(countElement.innerText.slice(1, -1));
  if (count == 0){
    alert("Vous avez atteint le nombre minimum de favoris");
    return;
  }
  count--;
  countElement.innerText = '(' + count + ')';


  if (indexToRemove !== -1) {
    favorites.splice(indexToRemove, 1);
    console.log(favorites); // Afficher les favoris mis à jour après suppression
  } else {
    alert("Cet élément n'est pas dans les favoris !");
  }
}




// Fonction pour récupérer les détails d'un film ou d'une série TV depuis l'API TMDB
async function fetchContentDetails(id, type) {
  // Clé d'API TMDB (remplacez 'YOUR_API_KEY' par votre propre clé)
  const apiKey = '4bff542b068c0fff85589d72c363051d';

  // URL de base de l'API TMDB
  const baseURL = 'https://api.themoviedb.org/3';

  // Endpoint spécifique pour récupérer les détails d'un film ou d'une série TV
  let endpoint;
  if (type === 'movie') {
    endpoint = `/movie/${id}`;
  } else if (type === 'tv') {
    endpoint = `/tv/${id}`;
  }
  else if (type === 'people') {
    endpoint = `/person/${id}`;
  } else {
    throw new Error('Type de contenu non pris en charge.');
  }

  // Construction de l'URL complète de l'API avec l'endpoint et la clé d'API
  const url = `${baseURL}${endpoint}?api_key=${apiKey}`;

  try {
    // Effectuer la requête GET à l'API TMDB
    const response = await fetch(url);
    // Vérifier si la réponse est OK
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données de l\'API TMDB');
    }
    // Récupérer les données JSON de la réponse
    const data = await response.json();
    // Retourner les détails du contenu
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du contenu:', error.message);
    throw error;
  }
}

// Fonction pour créer la carte à partir d'un favori
async function createFavoritesCard(id, type) {
  // Sélection de l'élément conteneur pour les favoris
  const favoritesContainer = document.querySelector('.list-contenu-fav');

  try {
    // Récupérer les détails du contenu depuis l'API TMDB
    const content = await fetchContentDetails(id, type);

    // Créer la carte en fonction du type de contenu
    let card;
    if (type === 'movie') {
      card = createMovieCardFavorite(content);
    } else if (type === 'tv') {
      card = createTvCardFavorite(content);
    }
    else if (type === 'people') {
      card = createPeopleCardFavorite(content);
    }
     else {
      throw new Error('Type de contenu non pris en charge.');
    }

    // Ajouter la carte au conteneur de favoris
    favoritesContainer.appendChild(card);
  } catch (error) {
    console.error('Erreur lors de la création de la carte du favori:', error.message);
  }
}
window.validateFavorite = function() {
  // Vérification si la taille des favoris est égale à 5
  if (favorites.length !== 5) {
    alert("Vous devez avoir exactement 5 favoris pour valider !");
    return;
  }


  // Parcourir les favoris et les ajouter à la base de données
  favorites.forEach(function(favorite,index) {
    var idType = favorite.type;
    var imdbId = favorite.id;
    
    // Utilisation de jQuery pour envoyer une requête AJAX
    $.ajax({
      url: 'assets/php/addFavorite.php',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        idType: idType,
        imdbId: imdbId
      }),
      success: function(response) {
        if (index === favorites.length - 1) {
          updateDemoColumn();
        }
      },
      error: function(xhr, status, error) {
        console.error('Erreur lors de l\'ajout du favori :', error);
      }
    });
  });
  function updateDemoColumn() {
    // Utilisation de jQuery pour envoyer une requête AJAX
    $.ajax({
      url: 'assets/php/updateDemoColumn.php',
      type: 'POST',
      success: function(response) {
        $('.dictaciel').remove();
        favorites = [];

        // Afficher un message de confirmation
        alert("Favoris validés et ajoutés à la base de données !");
      },
      error: function(xhr, status, error) {
        console.error('Erreur lors de la mise à jour de la colonne demo :', error);
      }
    });
  }
}
function addDictacielHTML() {
  var container = document.querySelector('article.container');

  // Vérifier si l'élément container existe
  if (container) {
    // Construction de la chaîne HTML
    var dictacielHTML = `
      <div class="dictaciel">
        <div class="dictaciel-header">
          <h1 class="dictaciel-title">Choisis au moins 5 Favoris </h1>
          <img src="assets/images/like.png" style="width:48px">
        </div>
        <div class="dictaciel-like" onclick="openIframeFav()">
          <img src="assets/images/nolike.png" style="width:48px">
          <h1>(0)</h1>
        </div>
        <div class="search-box" style="margin:auto; padding-top:2vh;" search-box>
          <div class="search-wrapper" search-wrapper>
            <input type="text" name="search" aria-label="search movies" placeholder="Search any contents..."
              class="search-field" autocomplete="off" search-field>

            <img src="./assets/images/search.png" width="24" height="24" alt="search" class="leading-icon">
          </div>

          <button class="search-btn" search-toggler>
            <img src="./assets/images/close.png" width="24" height="24" alt="close search box">
          </button>
        </div>

        <button class="search-btn" search-toggler menu-close>
          <img src="./assets/images/search.png" width="24" height="24" alt="open search box">
        </button>

        <div class="dictaciel-main"></div>
        <div class="dicta-list-favoris">
          <h1 class="dictaciel-title" style="position: relative;text-align: center;margin: 1em;">Tes favoris : </h1>
          <div class="list-contenu-fav"></div>
          <button class="btnValidateFav" onclick="validateFavorite()">Valide tes favoris</button>
          <img src="./assets/images/close.png" alt="Fav Close" class="closeIcon active" id="closeIconFav">
        </div>
      </div>
    `;

    // Ajout de la chaîne HTML à l'intérieur de l'élément container
    container.innerHTML += dictacielHTML;
    fetchAPIKeys().then(keys => {
    
      api_key = keys;
      initializePageDictaciel(); // Initialise la page une fois que les clés sont disponibles
      searchDictaciel();
    
    });

  } else {
    console.error("Element '.container' non trouvé !");
  }
}
if(window.addDictaciel){
  addDictacielHTML();
}








closeIframe();
popcorn();