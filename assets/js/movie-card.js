'use strict';

import { imageBaseURL } from "./api.js";



/**
 * movie card
 */

export function createMovieCard(movie) {
  const {
    poster_path,
    title,
    vote_average,
    release_date,
    id
  } = movie;

  const card = document.createElement("div");
  card.classList.add("movie-card");

  card.addEventListener("mouseover", function() {
    const favoriteElement = card.querySelector(".favorite");

    if (favoriteElement) {
      favoriteElement.style.display = "flex";
    }
  });

  card.addEventListener("mouseout", function() {
    const favoriteElement = card.querySelector(".favorite");

    if (favoriteElement) {
      favoriteElement.style.display = "none";
    }
  });

  card.innerHTML = `
    <figure class="poster-box card-banner">
      <img src="${imageBaseURL}w342${poster_path}" alt="${title}" class="img-cover" loading="lazy" onerror="this.src='assets/images/nofound.jpeg'" >
    </figure>
    
    <h4 class="title">${title}</h4>
    
    <div class="meta-list">
      <div class="meta-item">
        <img src="./assets/images/star.png" width="20" height="20" loading="lazy" onerror="this.src='assets/images/nofound.jpeg'" alt="rating">
    
        <span class="span">${vote_average.toFixed(1)}</span>
      </div>
    
      <div class="card-badge">${release_date.split("-")[0]}</div>
    </div>
    
    <a class="card-btn" title="${title}" onclick="getMovieDetail(${id})"></a>
    <div class="favorite">
      <img src="./assets/images/nolike.png" class="iconFavorite">
    </div>
  `;
  
  const iconFavorite = card.querySelector(".iconFavorite");

  if (iconFavorite) {
    // Vérifier si l'élément est déjà un favori
    checkIfFavorite("movie",id).then(isFavorite => {
      if (isFavorite) {
        // Si c'est déjà un favori, définir la source de l'icône sur "./assets/images/like.png"
        iconFavorite.src = "./assets/images/like.png";

        // Ajouter un gestionnaire d'événements pour la suppression des favoris
        iconFavorite.addEventListener("click", function() {
          removeFromFavorites("movie", id).then(success => {
            if (success) {
              iconFavorite.src = "./assets/images/nolike.png"; // Modifier l'icône si la suppression réussit
            }
          });
        });
      } else {
        // Si ce n'est pas un favori, ajouter les gestionnaires d'événements pour l'ajout aux favoris
        iconFavorite.addEventListener("click", function() {
          iconFavorite.src = "./assets/images/like.png";
          addToFavorites("movie", id);
        });

        iconFavorite.addEventListener("mouseover", function() {
          iconFavorite.src = "./assets/images/like_hover.png";
        });

        iconFavorite.addEventListener("mouseout", function() {
          iconFavorite.src = "./assets/images/nolike.png";
        });
      }
    }).catch(error => {
      console.error("Erreur lors de la vérification si c'est un favori :", error);
    });
  }

  return card;
}



// Fonction pour créer les cartes de séries TV
export function createTvCard(tvShow) {
  const {
    poster_path,
    name,
    vote_average,
    first_air_date,
    id
  } = tvShow;

  const card = document.createElement("div");
  card.classList.add("movie-card");
  card.addEventListener("mouseover", function() {
    const favoriteElement = card.querySelector(".favorite");

    if (favoriteElement) {
      favoriteElement.style.display = "flex";
    }
  });

  card.addEventListener("mouseout", function() {
    const favoriteElement = card.querySelector(".favorite");

    if (favoriteElement) {
      favoriteElement.style.display = "none";
    }
  });

  card.innerHTML = `
    <figure class="poster-box card-banner">
      <img src="${imageBaseURL}w342${poster_path}" alt="${name}" class="img-cover" loading="lazy" onerror="this.src='assets/images/nofound.jpeg'">
    </figure>
    
    <h4 class="title">${name}</h4>
    
    <div class="meta-list">
      <div class="meta-item">
        <img src="./assets/images/star.png" width="20" height="20" loading="lazy" onerror="this.src='assets/images/nofound.jpeg'" alt="rating">
    
        <span class="span">${vote_average.toFixed(1)}</span>
      </div>
    
      <div class="card-badge">${first_air_date.split("-")[0]}</div>
    </div>
    
    <a class="card-btn" title="${name}" onclick="getTvShowDetail(${id})"></a>
    <div class="favorite">
      <img src="./assets/images/nolike.png" class="iconFavorite">
    </div>
  `;

  const iconFavorite = card.querySelector(".iconFavorite");

  if (iconFavorite) {
    // Vérifier si l'élément est déjà un favori
    checkIfFavorite("tv",id).then(isFavorite => {
      if (isFavorite) {
        // Si c'est déjà un favori, définir la source de l'icône sur "./assets/images/like.png"
        iconFavorite.src = "./assets/images/like.png";

        // Ajouter un gestionnaire d'événements pour la suppression des favoris
        iconFavorite.addEventListener("click", function() {
          removeFromFavorites("tv", id).then(success => {
            if (success) {
              iconFavorite.src = "./assets/images/nolike.png"; // Modifier l'icône si la suppression réussit
            }
          });
        });
      } else {
        // Si ce n'est pas un favori, ajouter les gestionnaires d'événements pour l'ajout aux favoris
        iconFavorite.addEventListener("click", function() {
          iconFavorite.src = "./assets/images/like.png";
          addToFavorites("tv", id);
        });

        iconFavorite.addEventListener("mouseover", function() {
          iconFavorite.src = "./assets/images/like_hover.png";
        });

        iconFavorite.addEventListener("mouseout", function() {
          iconFavorite.src = "./assets/images/nolike.png";
        });
      }
    }).catch(error => {
      console.error("Erreur lors de la vérification si c'est un favori :", error);
    });
  }

  return card;
}

// Fonction pour créer les cartes d'animés
export function createAnimCard(anime) {
  const {
    poster_path,
    name,
    vote_average,
    first_air_date,
    id
  } = anime;


  const card = document.createElement("div");
  card.classList.add("movie-card");

  card.addEventListener("mouseover", function() {
    const favoriteElement = card.querySelector(".favorite");

    if (favoriteElement) {
      favoriteElement.style.display = "flex";
    }
  });

  card.addEventListener("mouseout", function() {
    const favoriteElement = card.querySelector(".favorite");

    if (favoriteElement) {
      favoriteElement.style.display = "none";
    }
  });
  card.innerHTML = `
    <figure class="poster-box card-banner" >
      <img src="${imageBaseURL}w342${poster_path}" alt="${name}" class="img-cover" loading="lazy" onerror="this.src='assets/images/nofound.jpeg'">

    </figure>
    
    <h4 class="title">${name}</h4>
    
    <div class="meta-list">
      <div class="meta-item">
        <img src="./assets/images/star.png" width="20" height="20" loading="lazy" onerror="this.src='assets/images/nofound.jpeg'" alt="rating">
    
        <span class="span">${vote_average.toFixed(1)}</span>
      </div>
    
      <div class="card-badge">${first_air_date.split("-")[0]}</div>
    </div>
    
    <a class="card-btn" title="${name}" onclick="getAnimeDetail(${id})"></a>
    <div class="favorite">
      <img src="./assets/images/nolike.png" class="iconFavorite">
    </div>

  `;
  const iconFavorite = card.querySelector(".iconFavorite");

  if (iconFavorite) {
    // Vérifier si l'élément est déjà un favori
    checkIfFavorite("tv",id).then(isFavorite => {
      if (isFavorite) {
        // Si c'est déjà un favori, définir la source de l'icône sur "./assets/images/like.png"
        iconFavorite.src = "./assets/images/like.png";

        // Ajouter un gestionnaire d'événements pour la suppression des favoris
        iconFavorite.addEventListener("click", function() {
          removeFromFavorites("tv", id).then(success => {
            if (success) {
              iconFavorite.src = "./assets/images/nolike.png"; // Modifier l'icône si la suppression réussit
            }
          });
        });
      } else {
        // Si ce n'est pas un favori, ajouter les gestionnaires d'événements pour l'ajout aux favoris
        iconFavorite.addEventListener("click", function() {
          iconFavorite.src = "./assets/images/like.png";
          addToFavorites("tv", id);
        });

        iconFavorite.addEventListener("mouseover", function() {
          iconFavorite.src = "./assets/images/like_hover.png";
        });

        iconFavorite.addEventListener("mouseout", function() {
          iconFavorite.src = "./assets/images/nolike.png";
        });
      }
    }).catch(error => {
      console.error("Erreur lors de la vérification si c'est un favori :", error);
    });
  }

  return card;
}

// Fonction pour créer les cartes de réalisateurs et d'acteurs
export function createPeopleCard(person) {
  const {
    profile_path,
    name,
    known_for_department,
    id
  } = person;

  const card = document.createElement("div");
  card.classList.add("movie-card");
  card.addEventListener("mouseover", function() {
    const favoriteElement = card.querySelector(".favorite");

    if (favoriteElement) {
      favoriteElement.style.display = "flex";
    }
  });

  card.addEventListener("mouseout", function() {
    const favoriteElement = card.querySelector(".favorite");

    if (favoriteElement) {
      favoriteElement.style.display = "none";
    }
  });

  card.innerHTML = `
    <figure class="poster-box card-banner">
      <img src="${imageBaseURL}w342${profile_path}" alt="${name}" class="img-cover" loading="lazy" onerror="this.src='assets/images/nofound.jpeg'">

    </figure>
    
    <h4 class="title">${name}</h4>
    
    <div class="meta-list">
      <div class="meta-item">${known_for_department}</div>
    </div>
    
    <a class="card-btn" title="${name}" onclick="getPersonDetail(${id})"></a>
    <div class="favorite">
      <img src="./assets/images/nolike.png" class="iconFavorite">
    </div>
  `;
  const iconFavorite = card.querySelector(".iconFavorite");

  if (iconFavorite) {

    // Vérifier si l'élément est déjà un favori
    checkIfFavorite("people",id).then(isFavorite => {
      if (isFavorite) {
        // Si c'est déjà un favori, définir la source de l'icône sur "./assets/images/like.png"
        iconFavorite.src = "./assets/images/like.png";

        // Ajouter un gestionnaire d'événements pour la suppression des favoris
        iconFavorite.addEventListener("click", function() {
          removeFromFavorites("people", id).then(success => {
            if (success) {
              iconFavorite.src = "./assets/images/nolike.png"; // Modifier l'icône si la suppression réussit
            }
          });
        });
      } else {
        // Si ce n'est pas un favori, ajouter les gestionnaires d'événements pour l'ajout aux favoris
        iconFavorite.addEventListener("click", function() {

          iconFavorite.src = "./assets/images/like.png";
          addToFavorites("people", id);
        });

        iconFavorite.addEventListener("mouseover", function() {

          iconFavorite.src = "./assets/images/like_hover.png";
        });

        iconFavorite.addEventListener("mouseout", function() {
          iconFavorite.src = "./assets/images/nolike.png";
        });
      }
    }).catch(error => {
      console.error("Erreur lors de la vérification si c'est un favori :", error);
    });
  }

  return card;
}
function addToFavorites(idType, imdbId) {
  // Récupérer les informations nécessaires depuis la carte (id, type, etc.)

  // Créer un objet contenant les données à envoyer
  const data = {
      id_type: idType,
      imdb_id: imdbId
  };

  // Envoyer une requête AJAX pour ajouter aux favoris
  fetch('assets/php/addToFavorites.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          // Si l'ajout aux favoris a réussi, vous pouvez effectuer des actions supplémentaires si nécessaire
          console.log('Ajout aux favoris réussi !');
      } else {
          // Si l'ajout aux favoris a échoué, vous pouvez gérer l'erreur ici
          console.error('Erreur lors de l\'ajout aux favoris :', data.message);
      }
  })
  .catch(error => {
      console.error('Erreur lors de l\'envoi de la requête AJAX :', error);
  });
}

function checkIfFavorite(idType, imdbId) {
  // Créer un objet contenant les données à envoyer
  const data = {
      id_type: idType,
      imdb_id: imdbId
  };

  // Envoyer une requête AJAX pour vérifier si c'est un favori
  return fetch('assets/php/checkIfFavorite.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
      if (data.isFavorite) {
          // Si c'est un favori, vous pouvez effectuer des actions supplémentaires si nécessaire
          console.log('C\'est un favori !');
      } else {
          // Si ce n'est pas un favori, vous pouvez gérer l'erreur ici
          console.log('Ce n\'est pas un favori.');
      }
      return data.isFavorite;
  })
  .catch(error => {
      console.error('Erreur lors de l\'envoi de la requête AJAX :', error);
      return false;
  });
}

// Fonction pour retirer un élément des favoris
function removeFromFavorites(idType, imdbId) {
  // Créer un objet contenant les données à envoyer
  const data = {
      id_type: idType,
      imdb_id: imdbId
  };

  // Envoyer une requête AJAX pour retirer des favoris
  return fetch('assets/php/removeFromFavorites.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          // Si la suppression des favoris réussit, retourner true
          return true;
      } else {
          // Si la suppression des favoris échoue, retourner false
          console.error('Erreur lors de la suppression des favoris :', data.message);
          return false;
      }
  })
  .catch(error => {
      console.error('Erreur lors de l\'envoi de la requête AJAX :', error);
      return false;
  });
}


export function createMovieCardAna(movie) {
  const {
    poster_path,
    title,
    vote_average,
    release_date,
    id
  } = movie;

  const card = document.createElement("div");
  card.classList.add("movie-card");
  card.classList.add("analytics");

  card.addEventListener("mouseover", function() {
    const favoriteElement = card.querySelector(".favorite");

    if (favoriteElement) {
      favoriteElement.style.display = "flex";
    }
  });

  card.addEventListener("mouseout", function() {
    const favoriteElement = card.querySelector(".favorite");

    if (favoriteElement) {
      favoriteElement.style.display = "none";
    }
  });

  card.innerHTML = `
    <figure class="poster-box card-banner-analytic">
      <img src="${imageBaseURL}w342${poster_path}" alt="${title}" class="img-cover" loading="lazy" onerror="this.src='assets/images/nofound.jpeg'" onerror="this.src='assets/images/nofound.jpeg'">
    </figure>
    
    <h4 class="title">${title}</h4>
    <a class="card-btn" title="${title}" tmdb-id="${id}" type="movie" img="${imageBaseURL}w342${poster_path}"></a>
    
  `;
  
  const iconFavorite = card.querySelector(".iconFavorite");

  if (iconFavorite) {
    // Vérifier si l'élément est déjà un favori
    checkIfFavorite("movie",id).then(isFavorite => {
      if (isFavorite) {
        // Si c'est déjà un favori, définir la source de l'icône sur "./assets/images/like.png"
        iconFavorite.src = "./assets/images/like.png";

        // Ajouter un gestionnaire d'événements pour la suppression des favoris
        iconFavorite.addEventListener("click", function() {
          removeFromFavorites("movie", id).then(success => {
            if (success) {
              iconFavorite.src = "./assets/images/nolike.png"; // Modifier l'icône si la suppression réussit
            }
          });
        });
      } else {
        // Si ce n'est pas un favori, ajouter les gestionnaires d'événements pour l'ajout aux favoris
        iconFavorite.addEventListener("click", function() {
          iconFavorite.src = "./assets/images/like.png";
          addToFavorites("movie", id);
        });

        iconFavorite.addEventListener("mouseover", function() {
          iconFavorite.src = "./assets/images/like_hover.png";
        });

        iconFavorite.addEventListener("mouseout", function() {
          iconFavorite.src = "./assets/images/nolike.png";
        });
      }
    }).catch(error => {
      console.error("Erreur lors de la vérification si c'est un favori :", error);
    });
  }

  return card;
}



// Fonction pour créer les cartes de séries TV
export function createTvCardAna(tvShow) {
  const {
    poster_path,
    name,
    vote_average,
    first_air_date,
    id
  } = tvShow;

  const card = document.createElement("div");
  card.classList.add("movie-card");
  card.classList.add("analytics");
  card.addEventListener("mouseover", function() {
    const favoriteElement = card.querySelector(".favorite");

    if (favoriteElement) {
      favoriteElement.style.display = "flex";
    }
  });

  card.addEventListener("mouseout", function() {
    const favoriteElement = card.querySelector(".favorite");

    if (favoriteElement) {
      favoriteElement.style.display = "none";
    }
  });

  card.innerHTML = `
    <figure class="poster-box card-banner-analytic">
      <img src="${imageBaseURL}w342${poster_path}" alt="${name}" class="img-cover" loading="lazy" onerror="this.src='assets/images/nofound.jpeg'">
    </figure>
    
    <h4 class="title">${name}</h4>
    <a class="card-btn" title="${name}" tmdb-id="${id}" type="tv"  img="${imageBaseURL}w342${poster_path}"></a>
    
  `;



  return card;
}

// Fonction pour créer les cartes d'animés
export function createAnimCardAna(anime) {
  const {
    poster_path,
    name,
    vote_average,
    first_air_date,
    id
  } = anime;


  const card = document.createElement("div");
  card.classList.add("movie-card");
  card.classList.add("analytics");

  card.addEventListener("mouseover", function() {
    const favoriteElement = card.querySelector(".favorite");

    if (favoriteElement) {
      favoriteElement.style.display = "flex";
    }
  });

  card.addEventListener("mouseout", function() {
    const favoriteElement = card.querySelector(".favorite");

    if (favoriteElement) {
      favoriteElement.style.display = "none";
    }
  });
  card.innerHTML = `
    <figure class="poster-box card-banner-analytic" >
      <img src="${imageBaseURL}w342${poster_path}" alt="${name}" class="img-cover" loading="lazy" onerror="this.src='assets/images/nofound.jpeg'">

    </figure>
    
    <h4 class="title">${name}</h4>
    <a class="card-btn" title="${name}" tmdb-id="${id}" type="tv"  img="${imageBaseURL}w342${poster_path}"></a>
    


  `;


  return card;
}

// Fonction pour créer les cartes de réalisateurs et d'acteurs
export function createPeopleCardAna(person) {
  const {
    profile_path,
    name,
    known_for_department,
    id
  } = person;

  const card = document.createElement("div");
  card.classList.add("movie-card");
  card.classList.add("analytics");
  card.addEventListener("mouseover", function() {
    const favoriteElement = card.querySelector(".favorite");

    if (favoriteElement) {
      favoriteElement.style.display = "flex";
    }
  });

  card.addEventListener("mouseout", function() {
    const favoriteElement = card.querySelector(".favorite");

    if (favoriteElement) {
      favoriteElement.style.display = "none";
    }
  });

  card.innerHTML = `
    <figure class="poster-box card-banner-analytic">
      <img src="${imageBaseURL}w342${profile_path}" alt="${name}" class="img-cover" loading="lazy" onerror="this.src='assets/images/nofound.jpeg'">

    </figure>
    
    <h4 class="title">${name}</h4>
    <a class="card-btn" title="${name}" tmdb-id="${id}" type="people"  img="${imageBaseURL}w342${profile_path}"></a>

  `;



  return card;
}


// AJOUT DE CODE POUR LA PARTIE QUIZZGPT


const apiKey = '4bff542b068c0fff85589d72c363051d'; // Assurez-vous que cette clé est gérée de manière sécurisée
const baseUrl = 'https://api.themoviedb.org/3';


export async function displayMovieCards(imdbIds) {
  const cardsContainer = document.querySelector('#cards-container');
  cardsContainer.innerHTML = ''; // Clear previous cards

  for (const imdbId of imdbIds) {
      const movie = await getMovieDetailsFromIMDbId(imdbId);
      if (movie) {  // Assurez-vous que l'objet movie n'est pas undefined
          const card = createMovieCard(movie);
          cardsContainer.appendChild(card);
      } else {
          console.error("Movie data not found for IMDb ID:", imdbId);
      }
  }
}

async function getMovieDetailsFromIMDbId(imdbId) {
  const url = `https://api.themoviedb.org/3/find/${imdbId}?api_key=4bff542b068c0fff85589d72c363051d&external_source=imdb_id`;
  try {
      const response = await fetch(url);
      const data = await response.json();
      return data.movie_results && data.movie_results[0]; // Assurez-vous de retourner le premier résultat de film, ou undefined si aucun n'est trouvé
  } catch (error) {
      console.error("Error fetching movie details:", error);
      return undefined;
  }
}