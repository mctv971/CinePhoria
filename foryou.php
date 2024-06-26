<?php
// Démarrage de la session
session_start();

// Vérification si l'utilisateur est connecté
if (!isset($_SESSION['client'])) {
    // Redirection vers la page de connexion si l'utilisateur n'est pas connecté
    header("Location: Filmaxium Accueil/Filmaxium Connexion/Inscription/inscription.php");
    exit;
}

// Récupération des informations de l'utilisateur depuis la session
$user_info = $_SESSION['client'];

// Affichage d'un message de bienvenue dans la console
echo "<script>console.log('Bienvenue, ".$user_info['prenom']." ".$user_info['nom']."');</script>";
?>


<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- 
    - primary meta tags
  -->
  <title>Filmaxium</title>
  <meta name="title" content="Filmaxium">
  <meta name="description" content="Filmaxium is a popular movie app">

  <!-- 
    - favicon
  -->
  <link rel="shortcut icon" href="./favicon.svg" type="image/svg+xml">

  <!-- 
    - google font link
  -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap" rel="stylesheet">

  <!-- 
    - custom css link
  -->
  <link rel="stylesheet" href="./assets/css/style.css">

  <!-- 
    - custom js link
  -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js"></script>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="./assets/js/global.js" defer></script>
  <script src="./assets/js/foryou.js" type="module"></script>

</head>

<body>

  <!-- 
    - #HEADER
  -->

  <header class="header">

    <a href="./index.php" class="logo">
      <img src="./assets/images/logo.png" width="140" height="32" alt="Filmaxium home">
    </a>


    <div class="search-box" search-box>
      <div class="search-wrapper" search-wrapper>
        <input type="text" name="search" aria-label="search movies" placeholder="Search any movies..."
          class="search-field" autocomplete="off" search-field>

        <img src="./assets/images/search.png" width="24" height="24" alt="search" class="leading-icon">
        <img src="./assets/images/play_circle.png" width="24" height="24" alt="search" class="leading-icon2">
      </div>

      <button class="search-btn" search-toggler>
        <img src="./assets/images/close.png" width="24" height="24" alt="close search box">
      </button>
    </div>

    <button class="search-btn" search-toggler menu-close>
      <img src="./assets/images/search.png" width="24" height="24" alt="open search box">
    </button>

    <div class="logo-right">
      <a href="./catalogue.php">
        <img src="./assets/images/logo-catalogue.png" width="60" height="60" alt="Catalogue">
      </a>
      <a href="./foryou.php">
        <img src="./assets/images/logo-film.png" width="60" height="60" alt="Find Film">
      </a>
      <a href="analytic.php">
        <img src="./assets/images/logo-stats.png" width="60" height="60" alt="Analytics home">
      </a>
      <a href="./profil.php">
        <img src="./assets/images/logo-profil.png" width="60" height="60" alt="Profil">
      </a>
    </div>

    

  </header>




  <main>
    <div class="backgroundOverlay"></div>
    <!-- 
      - #SIDEBAR
    -->
    <div class="iframeContainer">
      <iframe id="iframe"></iframe>
      <img src="./assets/images/close.png" alt="Iframe Close" class="closeIcon" id="closeIconGen">
    </div>

    <div class="iframeBouquetContainer">
      <div class="loadingBouquet active">
        <p style="position:relative;margin:auto; text-align:center">Les bouquets GPT sont des combinaisons de films générées par l'IA. Vous pouvez les utiliser pour trouver des films à regarder en fonction de votre humeur ou de votre temps libre.
      Etant donné que les bouquets sont générées par l'IA, il se peut que le chargement prenne un peu de temps. Merci de votre patience.</p>

      </div>

      <img src="./assets/images/close.png" alt="Iframe Close" class="closeIcon" id="closeIconBouquet"  onclick="closeBouquet()">
    </div>






    <article class="container" page-content>
      <div class="chatbot">
        <img src="assets/images/close.png"  class="close-chat">
        <iframe src="chat/chat4.php"  class="chat"></iframe>
      </div>
      <div class="popcorn-container">
      <img src="assets/images/popcorn-vierge.png" alt="Mr Popcorn" class="popcorn">
      </div>

      <!-- 
      - #SIDEBAR
    -->
      <div class="foryouGen">
        <h1 class="foryouTitle">For You</h1>
        <div class="foryouContainer">
          <div class="posterContainer">
            <div id="imageContainer">
             
            </div>
            <button id="generatePosterButton">Générer Poster</button>

          </div>

          <div class="quizzContainer">
            <button class="quizzBtn">Trouve ton bonheur <img src="assets/images/baguette.png" id="baguette" alt=""></button>
            <button class="bouquetBtn" onclick="bouquetGen()">Génère tes bouquets GPT <img src="assets/images/baguette.png" id="baguette" alt=""></button>
          </div>


        </div>

      </div>

      <div class="foryouRec">
        <h1 class="foryouTitle2">Recommandation Fait Pour Toi</h1>
        <div class="foryouRecommandationList">

        </div>

      </div>
      <div class="foryouBouquet">
        <h1 class="foryouTitle2">Crée ton Bouquet</h1>
        <p style="text-align:center">Entrez le nombre de minutes de divertissement disponible et cliquez sur le bouton pour trouver ton bouquet fait sur mesure (minimum 30min) :</p>
        <input type="number" id="inputNombre" min="30" placeholder="Entrez vos minutes ici">
        <button class="bouquetBtn" onclick="trouverCombinaisonAleatoire()" >Lance la création de bouquet <img src="assets/images/baguette.png" id="baguette" alt=""></button>

        <div class="foryouBouquetList">

        </div>
      </div>




 


      
    </article>
  </main>

</body>

</html>