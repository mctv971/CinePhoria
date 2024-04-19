'use strict';

// Fonction pour ajouter un ID à l'historique avec son numéro d'ordre
function addToHistory(itemId, itemType) {
  let history = localStorage.getItem('history');
  let currentNum = localStorage.getItem('currentNum');
  if (!history) {
    history = [];
    currentNum = 1;
  } else {
    history = JSON.parse(history);
    currentNum = parseInt(currentNum);
  }
  
  const entry = {
    num: currentNum,
    itemId: itemId,
    itemType: itemType
  };
  
  history.push(entry);
  localStorage.setItem('history', JSON.stringify(history));
  localStorage.setItem('currentNum', currentNum + 1);
}

// Fonction pour supprimer la dernière entrée de l'historique
function removeFromHistory() {
  let history = localStorage.getItem('history');
  let currentNum = localStorage.getItem('currentNum');
  if (!history) {
    return; // L'historique est vide
  }
  
  
  history = JSON.parse(history);
  history.pop(); // Supprimer la dernière entrée

  
  localStorage.setItem('history', JSON.stringify(history));
  localStorage.setItem('currentNum', currentNum - 1);
}

// Fonction pour récupérer l'historique des ID visités
function getHistory() {
  const history = localStorage.getItem('history');
  if (history) {
    return JSON.parse(history);
  } else {
    return [];
  }
}
function refreshPage() { 
  window.parent.postMessage('contenuModifie', '*');

}
function goBack() {
  // Supprimer la dernière entrée de l'historique
  removeFromHistory();
  
  // Récupérer l'historique mis à jour
  const history = getHistory();
  
  // Obtenez l'entrée la plus récente dans l'historique
  const lastEntry = history[history.length - 1];
  
  // Si l'historique n'est pas vide, revenez à la page précédente
  if (lastEntry) {
    // Par exemple, vous pouvez naviguer vers la page de détails de l'élément précédent
    // Dans cet exemple, nous allons simplement utiliser console.log
    localStorage.setItem('itemId', lastEntry.itemId );
    localStorage.setItem('itemType', lastEntry.itemType );
    console.log(`Revenir à l'élément précédent ${lastEntry.itemId} de type ${lastEntry.itemType}`);
  } else {
    // L'historique est vide, rien à faire
    console.log("L'historique est vide");
  }
  refreshPage()
}



/**
 * Add event on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (const elem of elements) elem.addEventListener(eventType, callback);
}


/**
 * Toggle search box in mobile device || small screen
 */

const searchBox = document.querySelector("[search-box]");
const searchTogglers = document.querySelectorAll("[search-toggler]");

addEventOnElements(searchTogglers, "click", function () {
  searchBox.classList.toggle("active");
});




/**
 * store movieId in `localStorage`.
 * when you click any movie card
 */

const getMovieDetail = function (movieId) {
  window.localStorage.setItem("itemId", String(movieId));
  window.localStorage.setItem("itemType", "movie");
  $('#iframe').attr('src', 'detail.php');       
  $('.backgroundOverlay').addClass('active');
  $('.iframeContainer').addClass('active');
  $('.closeIcon').addClass('active');
  addToHistory(String(movieId), "movie")

  const closeIconDetail = document.getElementById('closeIconDetail');
  if (closeIconDetail) {
    refreshPage();
  }

}



const getMovieList = function (urlParam, genreName) {
  window.localStorage.setItem("urlParam", urlParam);
  window.localStorage.setItem("genreName", genreName);
  
}

const getTvShowDetail = function (tvShowId) {
  window.localStorage.setItem("itemId", String(tvShowId));
  window.localStorage.setItem("itemType", "tv");
  $('#iframe').attr('src', 'detail.php');       
  $('.backgroundOverlay').addClass('active');
  $('.iframeContainer').addClass('active');
  $('.closeIcon').addClass('active');
  addToHistory(String(tvShowId), "tv");
  const closeIconDetail = document.getElementById('closeIconDetail');
  if (closeIconDetail) {
    refreshPage();
  }
}

const getAnimeDetail = function (animeId) {
  window.localStorage.setItem("itemId", String(animeId));
  window.localStorage.setItem("itemType", "tv");
  $('#iframe').attr('src', 'detail.php');       
  $('.backgroundOverlay').addClass('active');
  $('.iframeContainer').addClass('active');
  $('.closeIcon').addClass('active');
  addToHistory(String(animeId), "tv");
  const closeIconDetail = document.getElementById('closeIconDetail');
  if (closeIconDetail) {
    refreshPage();
  }
}

const getPersonDetail = function (personId) {
  window.localStorage.setItem("itemId", String(personId));
  window.localStorage.setItem("itemType", "people");
  $('#iframe').attr('src', 'detail.php');       
  $('.backgroundOverlay').addClass('active');
  $('.iframeContainer').addClass('active');
  $('.closeIcon').addClass('active');
  addToHistory(String(personId), "people");
  const closeIconDetail = document.getElementById('closeIconDetail');
  if (closeIconDetail) {
    refreshPage();
  }
}


const  closeIframe = function (){
  const elements = {
    iframeContainer: $('.iframeContainer'),
    backgroundOverlay: $('.backgroundOverlay'),
    closeIcon: $('#closeIconGen'),
    closeIconFavorite: $('#closeIconFav'),
    iframeFavorite: $('.dicta-list-favoris')
  };

  // Ajouter un gestionnaire d'événements au clic sur l'élément closeIcon
  elements.closeIcon.on('click', function() {
    localStorage.clear();
    // Cacher l'iframeContainer en retirant la classe "active"
    elements.iframeContainer.removeClass('active');
    
    // Cacher l'overlay en retirant la classe "active"
    elements.backgroundOverlay.removeClass('active');
    
    // Cacher l'icône de fermeture en retirant la classe "active"
    elements.closeIcon.removeClass('active');
  });
  elements.closeIconFavorite.on('click', function() {
    // Cacher l'iframeContainer en retirant la classe "active"
    elements.iframeFavorite.removeClass('active');
  
    
  });
  
}
function clearLocalStorageIfIframeNotActive() {
  // Vérifier si la classe iframeContainer est active
  const iframeContainer = document.querySelector('.iframeContainer');
  if (!iframeContainer || !iframeContainer.classList.contains('active')) {
    // Si la classe n'est pas active ou si iframeContainer n'existe pas, nettoyer le localStorage
    localStorage.clear();
    console.log("Le conteneur de l'iframe n'est pas actif, localStorage nettoyé.");
  } else {
    console.log("Le conteneur de l'iframe est actif, localStorage non nettoyé.");
  }
}
function favorite(){
  alert("VA TE FAIRE FOUTRE")
  var favorite = document.querySelector('.favorite');
  favorite.style.display = 'flex';
}













