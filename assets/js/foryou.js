import { createMovieCard, createTvCard } from "./movie-card";
import { popcorn } from "./popcorn.js";


// Fonction pour récupérer les favoris de l'utilisateur depuis getFavorite.php
var liste_similaire_movie = [];
var liste_similaire_tv = [];
var titles = [];
var favoris;

var liste_contenu_duree = {
    30: [],
    45: [],
    60: [],
    90: [],
    120: [],
    300: []
};

async function getFavorites() {
    $.ajax({
        url: 'assets/php/getFavorite.php',
        type: 'POST',
        dataType: 'json',
        success: async function(data) {
            favoris = data.favoris;

            await getSimilarTitlesForFavorites(data.favoris);




            


            getRecommandations();



        },
        error: function(xhr, status, error) {
            console.error("Erreur lors de la récupération des favoris:", error);
        }
    });
}
async function getMovieTitles(data) {
    const apiKey = '4bff542b068c0fff85589d72c363051d'; // Remplacez YOUR_TMDB_API_KEY par votre clé API TMDB

    for (const item of data) {
        if (item.id_type === 'movie' || item.id_type === 'tv') {
            const url = `https://api.themoviedb.org/3/${item.id_type}/${item.imdb_id}?api_key=${apiKey}&language=fr-FR`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération du titre du film ou de la série');
                }
                const responseData = await response.json();
                titles.push(responseData.title || responseData.name);
            } catch (error) {
                console.error(`Erreur lors de la récupération du titre pour l'ID TMDB ${item.imdb_id}:`, error.message);
            }
        }
        else if (item.id_type === 'people') {
            const url = `https://api.themoviedb.org/3/person/${item.imdb_id}?api_key=${apiKey}&language=fr-FR`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération du nom de la personne');
                }
                const responseData = await response.json();
                titles.push(responseData.name);
            } catch (error) {
                console.error(`Erreur lors de la récupération du nom pour l'ID TMDB ${item.imdb_id}:`, error.message);
            }
        }    
            
    }

    return titles;
}


function getSimilarTitlesForFavorites(favoris) {
    let promises = [];

    favoris.forEach(function(favori) {
        if(favori.id_type != 'people') {
            let promise = new Promise((resolve, reject) => {
                $.ajax({
                    url: 'https://api.themoviedb.org/3/' + favori.id_type + '/' + favori.imdb_id + '/similar',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        api_key: '4bff542b068c0fff85589d72c363051d', 
                        language: 'fr-FR', 
                    },
                    success: async function(response) {
                                            // Traitement des résultats de l'API TMDB
                  
                        for (var elm in response.results) {
                            if(favori.id_type == 'movie') {
                                const data = await getMovieDetails(response.results[elm].id);
                                if (data.runtime == null) {
                                    continue;
                                }

                                else if (data.runtime <= 30) {
                                    liste_contenu_duree[30].push(data);
                                } else if (data.runtime <= 45) {
                                    liste_contenu_duree[45].push(data);
                                } else if (data.runtime <= 60) {
                                    liste_contenu_duree[60].push(data);
                                } else if (data.runtime <= 90) {
                                    liste_contenu_duree[90].push(data);
                                }
                                else if (data.runtime <= 120) {
                                    liste_contenu_duree[120].push(data);
                                }
                                else {
                                    liste_contenu_duree[300].push(data);
                                }




                                liste_similaire_movie.push(data);
                            } else {
                                const data = await getTvDetails(response.results[elm].id);
                                if(data.last_episode_to_air){
                                    if(data.last_episode_to_air.runtime == null){
                                        continue;
                                    }
                                    else if (data.last_episode_to_air.runtime <= 30) {
                                        liste_contenu_duree[30].push(data);
                                    } else if (data.last_episode_to_air.runtime <= 45) {
                                        liste_contenu_duree[45].push(data);
                                    } else if (data.last_episode_to_air.runtime <= 60) {
                                        liste_contenu_duree[60].push(data);
                                    } else if (data.last_episode_to_air.runtime <= 90) {
                                        liste_contenu_duree[90].push(data);
                                    }
                                    else if (data.last_episode_to_air.runtime <= 120) {
                                        liste_contenu_duree[120].push(data);
                                    }
                                    else {
                                        liste_contenu_duree[300].push(data);
                                    }   
                                }
                            }
                        }
                        resolve();
                    },
                    error: function(xhr, status, error) {
                        console.error("Erreur lors de la récupération des titres similaires pour", favori.imdb_id + ':', error);
                        reject(error);
                    }
                });
            });
            promises.push(promise);
        }
    });

    return Promise.all(promises);
}
async function creerBouquetAutomatique(favoris, dureeSouhaitee) {
    let bouquet = [];
    let dureeRestante = dureeSouhaitee * 60; // Convertir en minutes

    for (let favori of favoris) {
        let similaires = await getSimilarTitles(favori.id, favori.type); // Récupérer des titres similaires
        // Trier les titres similaires par durée, du plus court au plus long
        similaires.sort((a, b) => a.duration - b.duration);

        for (let similaire of similaires) {
            let duration = await getDuration(similaire.id, similaire.type); // Récupérer la durée du titre
            if (dureeRestante >= duration) {
                bouquet.push(similaire);
                dureeRestante -= duration;
            }
            if (dureeRestante <= 0) break;
        }
        if (dureeRestante <= 0) break;
    }

    return bouquet;
}


function creerBouquetAleatoire(favoris, tempsDisponible) { // Bouquet de recommendation aléatoires
    let bouquet = [];
    let dureeRestante = tempsDisponible * 60; // Convertir en minutes
    let titresMelanges = shuffleArray(favoris); // Mélanger les favoris pour un choix aléatoire

    titresMelanges.some(favori => {
        if (dureeRestante >= favori.duree) {
            bouquet.push(favori);
            dureeRestante -= favori.duree;
        }
        return dureeRestante <= 0;
    });

    return bouquet;
}


function creerBouquetPersonnalise(favoris, heuresChoisies) { // Bouquet créé par l'utilisateur
    let bouquet = [];
    let dureeTotale = heuresChoisies * 60; // Convertir en minutes

    favoris.forEach(favori => {
        if (dureeTotale >= favori.duree) {
            bouquet.push(favori);
            dureeTotale -= favori.duree;
        }
    });
    return bouquet;
}






async function getMovieDetails(id) {
    const apiKey = '4bff542b068c0fff85589d72c363051d'; // Remplacez YOUR_TMDB_API_KEY par votre clé API TMDB

    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=fr-FR`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des détails du film');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Erreur lors de la récupération des détails pour le film avec l'ID ${id}:`, error.message);
        return null;
    }
}


async function getTvDetails(id) {
    const apiKey = '4bff542b068c0fff85589d72c363051d'; // Remplacez YOUR_TMDB_API_KEY par votre clé API TMDB

    const url = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=fr-FR`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des détails du film');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Erreur lors de la récupération des détails pour le film avec l'ID ${id}:`, error.message);
        return null;
    }
}


async function createContentBouquets(titles) {
    // Construction du prompt de base
    const titlesString = titles.join(', ');
    let prompt =`Tu es un professionnel cinématographique. Ton rôle est de créer des bouquets et des recommandations de films et de séries. J'aime les films/séries/personnes suivantes : ${titlesString} . Il faut que tu me crées 3 bouquets de recommandation du style de dailyMix de Spotify. Il doit être basé sur mes intêrêts mais il peut l'être indirectement en proposant des contenus similaires.  Je veux que tu répondes sans faire d'explication ou de phrases. Seulement les films et séries séparé par une virgule`


    // Longueur maximale des tokens est ajustée en fonction de la complexité attendue
    const maxLength = 1024;  // Choix arbitraire, ajustable selon les besoins

    // Génération du contenu avec ChatGPT
    const response = await chatGPTGenerate(prompt, maxLength);
    return response;
}

// La fonction chatGPTGenerate peut rester similaire à celle précédemment définie
async function chatGPTGenerate(prompt, maxLength) {
    const apiKey = '';
    const url = 'https://api.openai.com/v1/chat/completions';

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    const data = {
        model: "gpt-4",  // ou autre modèle selon les disponibilités et préférences
        messages: [{role: "user", content: prompt}],
        max_tokens: maxLength
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to generate content from GPT: ' + response.status);
        }

        const result = await response.json();
        return result.choices[0].message.content; // Retourner le contenu généré
    } catch (error) {
        console.error('Error generating content with ChatGPT:', error);
        return null;
    }
}

















// Appeler la fonction pour récupérer les favoris au chargement de la page
$(document).ready(async function() {


    $('#generatePosterButton').click(function() {
        $.ajax({
            type: "POST",
            url: "Poster/ton_serveur.php",  // Assurez-vous que cette URL est correcte
            data: {generatePoster: true},
            dataType: "json",
            success: function(response) {
                if(response && response.url) {
                    $('#imageContainer').empty();  // Efface les images précédentes
                    $('#imageContainer').append('<img src="' + response.url + '" alt="Poster de film";">');
                }
            },
            error: function() {
                alert("Erreur lors de la génération des images.");
            }
        });
    });

    $('.quizzBtn').click(function() {
        $('#iframe').attr('src', 'quizzgpt.php?reset=true');       
        $('.backgroundOverlay').addClass('active');
        $('.iframeContainer').addClass('active');
        $('.closeIcon').addClass('active');

    });
    $('.closeIcon').click(function() {
        $('#iframe').attr('src', '');       
        $('.backgroundOverlay').removeClass('active');
        $('.iframeContainer').removeClass('active');
        $('.closeIcon').removeClass('active');
    });
    await getFavorites();




});
function separerEnBouquets(texte) {
    // Supprimer "Contenu pour 1h30 : "
    texte = texte.replace(/^Contenu pour 1h30 : /, '');
  
    // Séparer le texte en bouquets
    const bouquets = texte.split('\n\n');
  
    // Formatter chaque bouquet
    const bouquetsFormate = bouquets.map(bouquet => {
      const lignes = bouquet.split('\n');
      const titre = lignes[0]; // Premier élément est le titre du bouquet
      const films = lignes.slice(1).join('\n'); // Le reste des éléments sont les films
      return `Bouquet ${titre}:\n${films}`;
    });
  
    return bouquetsFormate;
  }


function organiserBouquets(listeBouquets) {
    // Création d'un tableau pour stocker les films de chaque bouquet
    let films = {
        bouquet1: [],
        bouquet2: [],
        bouquet3: []
    };

    // Parcours de chaque élément de la liste de bouquets
    listeBouquets.forEach(bouquet => {
        // Suppression du préfixe "Bouquet Bouquet " pour obtenir le numéro du bouquet
        const numeroBouquet = bouquet.match(/\d+/)[0];
        // Suppression du préfixe et des caractères de saut de ligne, puis séparation des films
        const filmsBouquet = bouquet.replace(`Bouquet Bouquet ${numeroBouquet}: `, '').replace(/\n/g, '').split(', ');

        // Stockage des films dans le bon bouquet
        if (numeroBouquet === '1') {
            films.bouquet1 = filmsBouquet;
        } else if (numeroBouquet === '2') {
            films.bouquet2 = filmsBouquet;
        } else if (numeroBouquet === '3') {
            films.bouquet3 = filmsBouquet;
        }
    });

    return films;
}

  


window.bouquetGen = async function(){
    document.querySelector(".iframeBouquetContainer").classList.add("active");
    document.querySelector("#closeIconBouquet").classList.add("active");
    document.querySelector(".backgroundOverlay").classList.add("active");

    const test = document.querySelector(".bouquetTitle");
    if(test){
        document.querySelector(".loadingBouquet").classList.remove("active");
        return;
    }

    const observer = new MutationObserver((mutations) => {
        
        mutations.forEach((mutation) => {
            console.log(mutation);
            mutation.addedNodes.forEach(node => {
                if (node.classList && node.classList.contains('movie-card')) {
                    console.log(".movie-card added"); // Confirmer l'ajout
                    document.querySelector(".loadingBouquet").classList.remove("active");
                    observer.disconnect(); // Arrêter l'observation après le premier succès
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const title = await getMovieTitles(favoris);
    const content1h30 = await createContentBouquets(title);
    console.log('Contenu pour 1h30 :', content1h30);

    const bouquet = separerEnBouquets(content1h30);
    console.log(bouquet);
    const listeBouquets = organiserBouquets(bouquet);
    console.log(listeBouquets);
    await createCardsForBouquets(listeBouquets);
}


window.closeBouquet = function(){
    document.querySelector(".iframeBouquetContainer").classList.remove("active");
    document.querySelector(".closeIcon").classList.remove("active");
    document.querySelector(".backgroundOverlay").classList.remove("active");
    document.querySelector(".loadingBouquet").classList.add("active");


}

function getRecommandations(){
    const recommandation = document.querySelector('.foryouRecommandationList');

    for (var key in liste_contenu_duree){
        for (var content in liste_contenu_duree[key]){
            let card;
            
            if(liste_contenu_duree[key][content].name){
                card = createTvCard(liste_contenu_duree[key][content]);
            


            }
            else if(liste_contenu_duree[key][content].title){
                card = createMovieCard(liste_contenu_duree[key][content]);
            

            }
            recommandation.appendChild(card);


        }

    }   
}

async function createCardsForBouquets(bouquets) {
    const divBouquet = document.querySelector(".iframeBouquetContainer");

    let bouquetIndex = 1; // Pour suivre le numéro de bouquet

    for (const bouquetName in bouquets) {
        const moviesOrSeries = bouquets[bouquetName];
        const div = document.createElement('div');
        div.className = 'foryouRecommandationList'; 

        // Création et ajout du titre h1 pour le bouquet
        const title = document.createElement('h1');
        title.className = 'bouquetTitle';
        title.textContent = `Bouquet ${bouquetIndex} :`;
        div.appendChild(title);

        divBouquet.appendChild(div);

        for (const movieOrSeriesTitle of moviesOrSeries) {
            try {
                const searchData = await searchTMDB(movieOrSeriesTitle);
                if (searchData.results.length > 0) {
                    let card2;
                    const firstResult = searchData.results[0];
                    if (firstResult.media_type === 'movie') {
                        card2 = createMovieCard(firstResult);
                        div.appendChild(card2);
                    } else if (firstResult.media_type === 'tv') {
                        card2 = createTvCard(firstResult);
                        div.appendChild(card2);
                    }
                } else {
                    console.log('Aucun résultat trouvé pour :', movieOrSeriesTitle);
                }
            } catch (error) {
                console.error('Erreur lors de la recherche pour :', movieOrSeriesTitle, error);
            }
        }
        
        bouquetIndex++; // Incrémentation du numéro de bouquet pour le prochain bouquet
    }
}


async function searchTMDB(query) {
    const apiKey = '4bff542b068c0fff85589d72c363051d'; 
    const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data;
}
popcorn();


function combinaisonAleatoireProche(nombre) {
    const valeurs = [30, 45, 60, 90, 120, 300];
    let meilleuresCombinaisons = [];
    let meilleureDifference = Number.MAX_SAFE_INTEGER;

    function trouverCombinaison(index, sommeActuelle, combinaisonActuelle) {
        const difference = Math.abs(sommeActuelle - nombre);
        if (difference < meilleureDifference) {
            meilleuresCombinaisons = [combinaisonActuelle];
            meilleureDifference = difference;
        } else if (difference === meilleureDifference) {
            meilleuresCombinaisons.push(combinaisonActuelle);
        }
        if (index >= valeurs.length || sommeActuelle >= nombre) {
            return;
        }
        let i = 0;
        while (valeurs[index] * i + sommeActuelle <= nombre && i <= liste_contenu_duree[valeurs[index]].length) {
            trouverCombinaison(index + 1, sommeActuelle + valeurs[index] * i, {...combinaisonActuelle, [valeurs[index]]: i});
            i++;
        }
    }

    trouverCombinaison(0, 0, valeurs.reduce((acc, val) => ({...acc, [val]: 0}), {}));

    const randomIndex = Math.floor(Math.random() * meilleuresCombinaisons.length);
    return meilleuresCombinaisons[randomIndex];
}



function piocherElements(liste, n) {
    // Copier la liste originale pour éviter de modifier la liste passée en paramètre
    let listeTemporaire = [...liste];
    let resultat = [];

    // Vérifier si n est supérieur à la longueur de la liste
    if (n > listeTemporaire.length) {
        throw new Error("Le nombre d'éléments à piocher ne peut pas être supérieur à la longueur de la liste.");
    }

    // Piocher n éléments
    for (let i = 0; i < n; i++) {
        let indexAleatoire = Math.floor(Math.random() * listeTemporaire.length);
        resultat.push(listeTemporaire[indexAleatoire]);
        listeTemporaire.splice(indexAleatoire, 1);  // Retirer l'élément pioché de la liste temporaire
    }

    return resultat;
}



window.trouverCombinaisonAleatoire = function() {
    const nombre = parseInt(document.getElementById('inputNombre').value);
    const resultatDiv = document.querySelector(".foryouBouquetList")
    const combinaison = combinaisonAleatoireProche(nombre);
    resultatDiv.innerHTML = '';

    for (let key in combinaison) {
        if (combinaison[key] > 0) {
            let elements = piocherElements(liste_contenu_duree[key], combinaison[key]);
            for (let element of elements) {
                let card;
                if (element.name) {
                    card = createTvCard(element);
                    resultatDiv.appendChild(card);
                } else if (element.title) {
                    card = createMovieCard(element);
                    resultatDiv.appendChild(card);
                }
            }        
        }    
    }
}