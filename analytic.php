<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Analytique</title>
    <link rel="stylesheet" href="assets/css/style.css">  
    <script src="https://cdn.jsdelivr.net/npm/three@0.138.3/build/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.138.3/examples/js/loaders/GLTFLoader.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js"></script>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js"></script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;700&display=swap">

    <script src="./assets/js/global.js" defer></script>
    <script src="assets/js/analytic.js" type="module"></script>
</head>
<body class="body-analytic">
<div class="content-analytic">
<div class="page-content" style="display: flex; flex-wrap: wrap; justify-content: center;"></div>
  
  <div class="prediction">
  <h1 class="analyse-title" style="position: absolute; top: 30%; transform: translateY(-50%); width: 100%; text-align: center;">Prédiction</h1>
  <p class="prediction-texte" style="position: absolute; top: 40%; width: 100%; text-align: center; font-size: 30px;">Découvrez qui sera le gagnant des oscars grace à notre modèle de Prédiction</p>
  <button class="getPrediction" style="position: absolute; top: 60%; left: 50%; transform: translateX(-50%); border-radius: 20px; background-color: grey; width: 30%; text-align : center; font-size: 25px;">C'est ici que ça se passe</button>

  
</div>
  <nav class="navBtn" style="position: absolute; bottom: 10%; width: 5%; text-align: center; width: 5%">
    <button class="sectionBtn active" id="section1Btn"></button>
    <button class="sectionBtn" id="section2Btn"></button>
    <button class="sectionBtn" id="section3Btn"></button>
    <button class="sectionBtn" id="section4Btn"></button>
  </nav>
<script>
</script>
</div>
<script>

  async function fetchIMDbId(type, tmdbId) {
    const apiKey = "484b985c6e782eb80c4f40efc283376c";
    const url = `https://api.themoviedb.org/3/${type}/${tmdbId}/external_ids?api_key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.imdb_id || "IMDb ID not found";
    } catch (error) {
        console.error('Error fetching IMDb ID:', error);
        return null;
    }
}
const oscars_nominés = [
      

      { title : 'Barbie' , year: '2023', winner : 'False', itemId :346698 },
  
      { title : 'Maestro' , year: '2023',winner : 'False',itemId :523607},
  
      { title : 'The Zone of Interest' , year: '2023',winner : 'False',itemId :467244},
  
      { title : 'American Fiction' , year: '2023',winner : 'False',itemId :1056360},
  
      { title : 'Killers of the flower Moon' , year: '2023',winner : 'False',itemId :466420},
  
      { title : 'Oppenheimer' , year: '2023',winner : 'True',itemId :872585},
  
      { title : 'Past Lives' , year: '2023',winner : 'False',itemId :666277},
  
      { title : 'Poor Things' , year: '2023',winner : 'False',itemId :792307},
  
      { title : 'The Holdovers' , year: '2023',winner : 'False',itemId :840430},
  
      { title : 'Anatomy Of a Fall' , year: '2023',winner : 'False',itemId :915935}
  
  
  ];


  document.querySelector('.getPrediction').addEventListener('click', async () => {
    // Animer et faire disparaître le titre, le texte, et le bouton avant d'afficher les nominations
    gsap.to('.analyse-title, .prediction-texte, .getPrediction', {
        y: '-100%',
        opacity: 0,
        duration: 1.5,
        onComplete: async () => {
            // Une fois l'animation terminée, vide le conteneur et affiche les nominations
            const nominationsContainer = document.querySelector('.page-content');
            nominationsContainer.innerHTML = ''; // Vide uniquement le conteneur des nominations
            await displayOscarNominations();
            animateNominationsEntry();
        }
    });
});

async function displayOscarNominations() {
    const nominationsContainer = document.querySelector('.page-content');

    for (let i = 0; i < oscars_nominés.length; i++) {
        const film = oscars_nominés[i];
        const imdbId = await fetchIMDbId('movie', film.itemId);
        const filmElement = document.createElement('div');
        filmElement.classList.add('film-nomination', i < 5 ? 'right' : 'left');
        const posterPath = `https://image.tmdb.org/t/p/w500/${film.poster_path}`;
        filmElement.innerHTML = `
            <img src="${posterPath}" alt="${film.title} Poster" style="width: 100px; height: 150px;" data-imdb-id="${imdbId}">
        `;
        nominationsContainer.appendChild(filmElement);
    }
}

function animateNominationsEntry() {
    gsap.from('.right', {
        x: '100%',
        opacity: 0,
        duration: 1.5,
        stagger: 0.1
    });

    gsap.from('.left', {
        x: '-100%',
        opacity: 0,
        duration: 1.5,
        stagger: 0.1
    });
}

</script>

<style>
</style>
</body>
</html>
