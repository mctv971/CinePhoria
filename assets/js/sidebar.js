'use strict';
import { fetchAPIKeys, imageBaseURL, fetchDataFromServer } from "./api.js";
let api_key

fetchAPIKeys().then(keys => {
  api_key = keys;
  initializePage(); // Initialise la page une fois que les clés sont disponibles
});


const initializePage = () => {
  // Votre code JavaScript ici
  
  // Exemple : Vous pouvez appeler votre fonction sidebar ici
  sidebar();
};
export function sidebar() {
  /**
   * fetch all genres eg: [ { "id": "123", "name": "Action" } ]
   * then change genre formate eg: { 123: "Action" }
   */
  const genreList = {};

  fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, function ({ genres }) {
    for (const { id, name } of genres) {
      genreList[id] = name;
    }

    genreLink();
    
  });


  const sidebarInner = document.createElement("div");
  sidebarInner.classList.add("sidebar-inner");

  sidebarInner.innerHTML = `
    <div class="sidebar-list">
    
      <p class="title" style="text-align:center";>Genre</p>
    
    </div>
    
    <div class="sidebar-list">
    
      <p class="title" style="text-align:center";>Language</p>
    
      <a href="./movie-list.php" menu-close class="sidebar-link"
        onclick='getMovieList("with_original_language=en", "English")'>English</a>
    
      <a href="./movie-list.php" menu-close class="sidebar-link"
        onclick='getMovieList("with_original_language=hi", "Hindi")'>Hindi</a>
    
      <a href="./movie-list.php" menu-close class="sidebar-link"
        onclick='getMovieList("with_original_language=bn", "Bengali")'>Bengali</a>
      <a href="./movie-list.php" menu-close class="sidebar-link"
      onclick='getMovieList("with_original_language=fr", "French")'>Français</a>  
    
    </div>
    
    <div class="sidebar-footer">
    
      <img src="./assets/images/tmdb-logo.svg" width="130" height="17" alt="the movie database logo">
    </div>
  `;



  const genreLink = function () {


    for (const [genreId, genreName] of Object.entries(genreList)) {

      const link = document.createElement("a");
      link.classList.add("sidebar-link");
      link.setAttribute("href", "./movie-list.php");
      link.setAttribute("menu-close", "");
      link.setAttribute("onclick", `getMovieList("with_genres=${genreId}", "${genreName}")`);
      link.textContent = genreName;

      sidebarInner.querySelectorAll(".sidebar-list")[0].appendChild(link);

    }

    const sidebar = document.querySelector("[sidebar]");
    sidebar.appendChild(sidebarInner);
    addFilterForm(sidebarInner);
    toggleSidebar(sidebar);

  }
  function addFilterForm(parentElement) {
    const form = document.createElement("form");
    form.id = "filter-form";
    form.innerHTML = `
      <div class="form-group">
        <label for="genre-select">Genre:</label>
        <select id="genre-select" name="genre">
          <option value="">Any</option>
        </select>
      </div>
      <div class="form-group">
        <label for="country-select">Pays:</label>
        <select id="country-select" name="country">
          <option value="">Any</option>
        </select>
      </div>
      <div class="form-group">
        <label for="date-from">De:</label>
        <input type="date" id="date-from" name="dateFrom">
        <label for="date-to">À:</label>
        <input type="date" id="date-to" name="dateTo">
      </div>
      <button id="filterbtn" type="submit">Appliquer les filtres</button>
    `;
    parentElement.appendChild(form);
  
    fetchDataFromServer('https://api.themoviedb.org/3/genre/movie/list?api_key=' + api_key, function({ genres }) {
      const genreSelect = document.getElementById('genre-select');
      genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
      });
    });
  
    fetchDataFromServer('https://api.themoviedb.org/3/configuration/countries?api_key=' + api_key, function(countries) {
      const countrySelect = document.getElementById('country-select');
      countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.iso_3166_1;
        option.textContent = country.english_name;
        countrySelect.appendChild(option);
      });
    });
  
    form.addEventListener('submit', handleFilterSubmit);
  }
  
  function handleFilterSubmit(e) {
    e.preventDefault();
    const genre = document.getElementById('genre-select').value;
    const country = document.getElementById('country-select').value;
    const dateFrom = document.getElementById('date-from').value;
    const dateTo = document.getElementById('date-to').value;
  
    let urlParams = `sort_by=popularity.desc&include_adult=false`;
    if (genre) urlParams += `&with_genres=${genre}`;
    if (country) urlParams += `&region=${country}`;
    if (dateFrom) urlParams += `&release_date.gte=${dateFrom}`;
    if (dateTo) urlParams += `&release_date.lte=${dateTo}`;

    getMovieList(urlParams, 'Filtered Movies');
  
    window.location.href = `./movie-list.php`;
  }
  


  const toggleSidebar = function (sidebar) {
    /**
     * Toggle sidebar in mobile screen
     */

    const sidebarBtn = document.querySelector("[menu-btn]");
    const sidebarTogglers = document.querySelectorAll("[menu-toggler]");
    const sidebarClose = document.querySelectorAll("[menu-close]");
    const overlay = document.querySelector("[overlay]");

    addEventOnElements(sidebarTogglers, "click", function () {
      sidebar.classList.toggle("active");
      sidebarBtn.classList.toggle("active");
      overlay.classList.toggle("active");
    });

    addEventOnElements(sidebarClose, "click", function () {
      sidebar.classList.remove("active");
      sidebarBtn.classList.remove("active");
      overlay.classList.remove("active");
    });

  }

}
