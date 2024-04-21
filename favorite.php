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
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="./assets/js/global.js" defer></script>
  <script src="./assets/js/favorite.js" type="module"></script>

</head>

<body style="background:none">

  <!-- 
    - #HEADER
  -->






  <main>
    <div class="backgroundOverlay"></div>
    <!-- 
      - #SIDEBAR
    -->
    <div class="iframeContainer">
      <iframe id="iframe"></iframe>
      <img src="./assets/images/close.png" alt="Iframe Close" class="closeIcon" id="closeIconGen">
    </div>
 






    <article class="container"style="background:none" page-content>
      <!-- 
      - #SIDEBAR
    -->
     <h1 class =title-large>Favoris </h1>




 


      
    </article>
  </main>

</body>

</html>