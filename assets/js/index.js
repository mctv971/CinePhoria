'use strict';

/**
 * import all components and functions
 */

import { sidebar } from "./sidebar.js";
import { fetchAPIKeys, imageBaseURL, fetchDataFromServer } from "./api.js";
import { createMovieCard, createAnimCard, createPeopleCard, createTvCard } from "./movie-card.js";
import { search, searchDictaciel } from "./search.js";
import { popcorn } from "./popcorn.js";



let api_key;
const pageContent = document.querySelector("[page-content]");

sidebar();
fetchAPIKeys().then(keys => {
  api_key = keys;
  initializePage(); // Initialise la page une fois que les clés sont disponibles
  initializePageDictaciel();
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












window.addEventListener('message', function(event) {
  // Vérifie si le message reçu est celui indiquant que le contenu de l'iframe a été modifié
  if (event.data === 'contenuModifie') {
      // Actualise l'iframe en rechargeant son contenu
      document.getElementById('iframe').contentWindow.location.reload();
  }
}, false);

window.onload = clearLocalStorageIfIframeNotActive;




closeIframe();
searchDictaciel();
popcorn();