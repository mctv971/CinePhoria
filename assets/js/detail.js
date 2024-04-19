'use strict';
import { fetchAPIKeys, imageBaseURL, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard, createTvCard } from "./movie-card.js";
import { search } from "./search.js";

let api_key;
const itemId = window.localStorage.getItem("itemId");
const itemType = window.localStorage.getItem("itemType");
const pageContent = document.querySelector("[page-content]");

sidebar();
fetchAPIKeys().then(keys => {
  api_key = keys;
  initializePage(); // Initialise la page une fois que les clés sont disponibles
});

const initializePage = () => {
const getGenres = function (genreList) {
  const newGenreList = [];

  for (const { name } of genreList) newGenreList.push(name);

  return newGenreList.join(", ");
}

const getCasts = function (castList) {
  const newCastList = [];

  for (let i = 0, len = castList.length; i < len && i < 10; i++) {
    const { name, id } = castList[i];
    newCastList.push(`<span class="person" onclick="getPersonDetail(${id})">${name}, </span>`);
  }

  return newCastList.join("");
}

const getDirectors = function (crewList) {
  const directors = crewList.filter(({ job }) => job === "Director");

  const directorList = [];
  for (const { name, id } of directors) directorList.push(`<span class="person" onclick="getPersonDetail(${id})">${name},</span>`);

  return directorList.join("");
}


const fetchDetails = function (itemId, itemType) {
  if (itemType === "people") {
    fetchPeopleDetails(itemId);
  }
  else{
    const endpoint = itemType === "movie" ? "movie" : "tv";
    fetchDataFromServer(`https://api.themoviedb.org/3/${endpoint}/${itemId}?api_key=${api_key}&append_to_response=credits,videos,images,external_ids`, function (item) {
      const {
        backdrop_path,
        poster_path,
        title,
        name,
        release_date,
        first_air_date,
        runtime,
        episode_run_time,
        vote_average,
        genres,
        overview,
        number_of_seasons,
        credits: { cast, crew },
        videos: { results: videos },
        seasons
      } = item;

      document.title = `${title || name} - Filmaxium`;

      const itemDetail = document.createElement("div");
      itemDetail.classList.add(`movie-detail`);

      itemDetail.innerHTML = `
        <div class="backdrop-image" style="background-image: url('${imageBaseURL}${"w1280" || "original"}${backdrop_path || poster_path}')"></div>
        
        <figure class="poster-box movie-poster">
          <img src="${imageBaseURL}w342${poster_path}" alt="${title || name} poster" class="img-cover">
        </figure>
        
        <div class="detail-box">
        
          <div class="detail-content">
            <h1 class="heading">${title || name}</h1>
        
            <div class="meta-list">
        
              <div class="meta-item">
                <img src="./assets/images/star.png" width="20" height="20" alt="rating">
        
                <span class="span">${vote_average.toFixed(1)}</span>
              </div>
        
              <div class="separator"></div>
        
              <div class="meta-item">${runtime || number_of_seasons} ${itemType === "tv" ? `Seasons` : "m"}
              </div>
        
              <div class="separator"></div>
        
              <div class="meta-item">${release_date?.split("-")[0] || first_air_date?.split("-")[0] || "Not Released"}</div>
        
            </div>
        
            <p class="genre">${getGenres(genres)}</p>
        
            <p class="overview">${overview}</p>
        
            <ul class="detail-list">
        
              <div class="list-item">
                <p class="list-name">Starring</p>
                <div class="casting">
                ${getCasts(cast)}</div>
              </div>
        
              <div class="list-item">
                <p class="list-name">Directed By</p>
                <div class="casting">
                ${getDirectors(crew)}</div>
              </div>
        
            </ul>

        
          </div>
          ${itemType === "tv" ? `
          <div class="seasons-menu">
            <h3 class="title-large">Seasons</h3>
            <ul class="seasons-list">
              ${createSeasonsMenu(seasons)}
            </ul>
          </div>
        ` : ""}
        
          <div class="title-wrapper">
            <h3 class="title-large">Trailers and Clips</h3>
          </div>
        
          <div class="slider-list">
            <div class="slider-inner"></div>
          </div>
        
        </div>
      `;

      for (const { key, name } of videos) {
        const videoCard = document.createElement("div");
        videoCard.classList.add("video-card");

        videoCard.innerHTML = `
          <iframe width="500" height="294" src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0"
            frameborder="0" allowfullscreen="1" title="${name}" class="img-cover" loading="lazy"></iframe>
        `;

        itemDetail.querySelector(".slider-inner").appendChild(videoCard);
      }

      pageContent.appendChild(itemDetail);

      fetchRecommendations(itemId, itemType);
    });
  }  
};

const fetchPeopleDetails = function (personId) {
  fetchDataFromServer(`https://api.themoviedb.org/3/person/${personId}?api_key=${api_key}&append_to_response=combined_credits,images`, function (person) {
    const {
      name,
      popularity,
      birthday,
      biography,
      profile_path,
      combined_credits: { cast, crew },
      images
    } = person;

    // Créer la page de détails de la personne
    const peopleDetailPage = createPeopleDetailPage(name, popularity, birthday, biography, profile_path, cast, crew, images);

    // Ajouter la page de détails de la personne au contenu de la page
    pageContent.appendChild(peopleDetailPage);
    fetchPersonRecommendations(personId)
  });
};

const createPeopleDetailPage = function (name, popularity, birthday, biography, profile_path, cast, crew, images) {
  const peopleDetailPage = document.createElement("div");
  peopleDetailPage.classList.add("movie-detail");
  peopleDetailPage.innerHTML = `
    <div class="backdrop-image" style="background-image: url('${imageBaseURL}${profile_path}')"></div>
          
    <figure class="poster-box movie-poster">
      <img src="${imageBaseURL}w342${profile_path}" alt="${name} poster" class="img-cover">
    </figure>

    <div class="detail-box">
          
    <div class="detail-content">
      <h1 class="heading">${name}</h1>

      <div class="meta-list">

        <div class="meta-item">
          <img src="./assets/images/star.png" width="20" height="20" alt="rating">

          <span class="span">${popularity.toFixed(1)}</span>
        </div>

        <div class="separator"></div>

        <div class="meta-item"> Born : ${birthday ? birthday : 'date unknown'}
        </div>

      </div>

      <p class="overview">${biography}</p>

    </div>
  `;
  return peopleDetailPage;
};



const fetchRecommendations = function (itemId, itemType) {
  const endpoint = itemType === "movie" ? "movie" : "tv";
  fetchDataFromServer(`https://api.themoviedb.org/3/${endpoint}/${itemId}/recommendations?api_key=${api_key}&page=1`, addRecommendedItems);
};

const fetchPersonRecommendations = function (personId) {
  // Pour les films
  fetchDataFromServer(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&with_people=${personId}`, function (data) {
    addRecommendedItemsPeople(data, "movie");
  });


};

const addRecommendedItemsPeople = function ({ results: itemList }, itemType) {
  if (itemList.length === 0) {
    return; // Si la liste est vide, ne rien afficher
  }

  const itemListElem = document.createElement("section");
  itemListElem.classList.add(`movie-list`);
  itemListElem.ariaLabel = `Present in his ${itemType === "movie" ? "Movies" : "TV Shows"}`;

  itemListElem.innerHTML = `
    <div class="title-wrapper">
      <h3 class="title-large">Present in his ${itemType === "movie" ? "Movies" : "TV Shows"}</h3>
    </div>
    
    <div class="slider-list">
      <div class="slider-inner"></div>
    </div>
  `;

  for (const item of itemList) {
    const itemCard = itemType === "movie" ? createMovieCard(item) : createTvCard(item); // Utilisez la fonction appropriée pour créer la carte d'élément

    itemListElem.querySelector(".slider-inner").appendChild(itemCard);
  }

  pageContent.appendChild(itemListElem);
};




const addRecommendedItems = function ({ results: itemList }, title) {
  const itemListElem = document.createElement("section");
  itemListElem.classList.add(`movie-list`);
  itemListElem.ariaLabel = "You May Also Like";

  itemListElem.innerHTML = `
    <div class="title-wrapper">
      <h3 class="title-large">You May Also Like</h3>
    </div>
    
    <div class="slider-list">
      <div class="slider-inner"></div>
    </div>
  `;

  for (const item of itemList) {
    const itemCard = itemType === "movie" ? createMovieCard(item) : createTvCard(item); // Utilisez la fonction appropriée pour créer la carte d'élément

    itemListElem.querySelector(".slider-inner").appendChild(itemCard);
  }

  pageContent.appendChild(itemListElem);
};


window.fetchSeasonEpisodes = function(seasonNumber, itemId, itemType) {
    const episodesContainer = document.querySelector(".season-episodes");
  if (episodesContainer) {
    episodesContainer.remove(); // Supprimer complètement l'élément
  }
  const endpoint = itemType === "movie" ? "movie" : "tv";
  fetchDataFromServer(`https://api.themoviedb.org/3/${endpoint}/${itemId}/season/${seasonNumber}?api_key=${api_key}`, function(season) {
    const { episodes, poster_path } = season;
    const seasonEpisodesContainer = document.createElement("div");
    seasonEpisodesContainer.classList.add("season-episodes");

    // Ajouter le titre de la saison
    seasonEpisodesContainer.innerHTML = `
      <div class="episode-list">
        ${createEpisodeList(episodes, season.poster_path)}
      </div>
    `;

    // Ajouter le conteneur des épisodes de la saison à la page de détail
    const seasonsMenu = document.querySelector(".seasons-menu");
    seasonsMenu.appendChild(seasonEpisodesContainer);
  });
};

const createSeasonsMenu = function(seasons) {
  let seasonsMenuHTML = `
    <select class="seasons-dropdown" onchange="fetchSeasonEpisodes(this.value, window.localStorage.getItem('itemId'))">
      <option value="">Select a season</option>
  `;
  for (const season of seasons) {
    seasonsMenuHTML += `
      <option value="${season.season_number}">Season ${season.season_number}</option>
    `;
  }
  seasonsMenuHTML += `</select>`;
  return seasonsMenuHTML;
};



const createEpisodeList = function(episodes,serieImageURL) {
  



  let episodeListHTML = "";
  for (const episode of episodes) {
    let imageURL;
    if (episode.still_path) {
      imageURL = episode.still_path;
    } else {
      imageURL = serieImageURL;
    }
    episodeListHTML += `
    <div class="episode-item">
      <h3 class="title">Episode ${episode.episode_number} - ${episode.name}</h3>
      <div class="episode-details">
        <img src="${imageBaseURL}w342/${imageURL}}" alt="Episode ${episode.episode_number} Image" class="episode-image">
        <p class="episode-overview">${episode.overview}</p>
      </div>
    </div>
    `;
  }
  return episodeListHTML;
};
function isCurrentNumGreaterThan2() {
  // Récupérer currentNum depuis le localStorage
  const currentNum = parseInt(localStorage.getItem('currentNum')) || 0;
  
  // Vérifier si currentNum est supérieur à 2
  if (currentNum > 2) {
    const closeIconDetail = document.getElementById('closeIconDetail');
    closeIconDetail.style.display = 'block';

  }
}



isCurrentNumGreaterThan2();




fetchDetails(itemId, itemType);
closeIframe();
search();
}