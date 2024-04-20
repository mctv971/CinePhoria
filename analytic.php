<?php
// Démarrage de la session
session_start();

// Vérification si l'utilisateur est connecté
if (!isset($_SESSION['client'])) {
    // Redirection vers la page de connexion si l'utilisateur n'est pas connecté
    header("Location: Filmaxium Accueil/Filmaxium Connexion/Inscription/inscription.php");
    exit;
}
?>


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

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js"></script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;700&display=swap">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Bungee&display=swap" rel="stylesheet">

    <script src="./assets/js/global.js" defer></script>
    <script src="assets/js/analytic.js" type="module"></script>
</head>
<body class="body-analytic">
  <div class="backgroundOverlay"></div>
    <!-- 
      - #SIDEBAR
    -->
    <div class="iframeContainer">
      <iframe id="iframe"></iframe>
      <img src="./assets/images/close.png" alt="Iframe Close" class="closeIcon" id="closeIconGen">
    </div>


  <div class="content-analytic">
    <div  class="BtnMenuOverlay">
    <a href="index.php"><img src="assets/images/play_circle.png" alt="Bouton Filmaxium" ></a>
    <img src="assets/images/menu.png" alt="" onclick="openMenuSection(this)">
    

    </div>









    <nav class ="navBtn">
      <button class="sectionBtn active" id="section1Btn"></button>
      <button class="sectionBtn" id="section2Btn"></button>
      <button class="sectionBtn"id="section3Btn"></button>
      <button class="sectionBtn"id="section4Btn"></button>
      
    </nav>
    
    <div class="navBtnMenuOverlay">
      <nav class ="navBtnMenu">
        <button class="sectionBtnMenu" id="section1Btn"><h1 class="btnMenu">Home</h1></button>
        <button class="sectionBtnMenu" id="section2Btn"><h1 class="btnMenu">Analyse</h1></button>
        <button class="sectionBtnMenu"id="section3Btn"><h1 class="btnMenu">Statistics Tests</h1></button>
        <button class="sectionBtnMenu"id="section4Btn"><h1 class="btnMenu">Prediction</h1></button>
      </nav>

    </div>

    
    
    
  </div>

</body>
</html>
