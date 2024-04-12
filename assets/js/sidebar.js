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
    toggleSidebar(sidebar);

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
