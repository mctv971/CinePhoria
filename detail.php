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
  <script src="./assets/js/detail.js" type="module"></script>
  <script type="text/javascript" src="assets/js/commentaires.js"></script>

</head>

<body>

  <!-- 
    - #HEADER
  -->
  


  



  <main>
    
    <!-- 
      - #SIDEBAR
    -->

    <img src="./assets/images/retour.png" alt="Iframe Close" class="closeIcon" id="closeIconDetail" onclick="goBack()">
    <!-- 
      - #SIDEBAR
    -->
    <img src="./assets/images/chat.png" alt="Chat Icone" class="closeIcon" id="chatIconDetail">






    <article class="container detail" page-content>
      <div class="commentaires">
        <h1 id="titre-commentaire">Commentaires</h1>

        <div id="commentaires-liste">
          <!-- Les commentaires seront ajoutés dynamiquement ici -->
        </div>

        <!-- Formulaire pour ajouter un commentaire -->
        <form id="commentaire-formulaire">
          <input type="hidden" id="id_type" value=""> 
          <input type="hidden" id="imdb_id" value=""> 
          <input type="hidden" id="id_commentaire_parent" value=""> 
          <input id="contenu" placeholder="Ajouter un commentaire">
          <button id="commentBtn" type="submit">Envoyer</button>
        </form>

        <p class="retour-fiche">Retour à la fiche</p>

        <!-- Section pour afficher les commentaires -->

      </div>


      <!-- 
      - #MOVIE DETAIL
    -->









      
    </article>

  </main>

</body>

</html>