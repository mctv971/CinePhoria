<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="Accueil.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500&display=swap" rel="stylesheet">
    <script type="module" src="https://unpkg.com/@splinetool/viewer@1.0.93/build/spline-viewer.js" onload="initPage()"></script>
    <script src="assets/js/animation.js"></script>

    <title>Filmaxium </title>
</head>
<body class="pageinscription">
    <a href="inscription.html">  
        <img src="../images/logo.png" alt="Logo">
    </a>

    <div class="inscription-container">
        <div id="inscriptionTextContainer" style="display:none;">
            <spline-viewer style="height:300px; width:800px" id="inscriptionAnimation" url="https://prod.spline.design/ToB0Hxw30gFwEscB/scene.splinecode"></spline-viewer>
            <p id="assistantText">Bienvenue sur la page d'inscription de la Plateforme Filmaxium.</p>
        </div>
        <spline-viewer id="secondAnimation" style="height:300px; width:800px; display:none;" url="https://prod.spline.design/pPpssgoN0Mt1Fyqq/scene.splinecode"></spline-viewer>
        <spline-viewer id="thirdAnimation" style="height:300px; width:800px; display:none;" url="https://prod.spline.design/RGqwOwhHTuxYGirX/scene.splinecode"></spline-viewer>
        <spline-viewer id="finalAnimation" style="height:300px; width:800px; display:none;" url="https://prod.spline.design/gvdauOZcgno9n0sh/scene.splinecode"></spline-viewer>
        
        <p id="assistantText" style="display:none;">Bienvenue sur la page d'inscription de la Plateforme Filmaxium.</p>
        <p id="guideText" style="display:none;">Je vais être ton assistant tout au long de ton aventure !</p>
        <p id="Oups" style="display:none;">Oups! Ici on m'appel Bugs, et toi c'est quoi ton pseudonyme ?</p>
        <input type="text" id="usernameInput" style="display:none;" placeholder="Entrez votre username">  <br /> 
    </div>

    <a href="formulaire.php?username=">
        <img src="../images/Bouton.png" alt="Flèche" id="arrowButton" class="arrow-button" style="display:none;">
    </a>
</body>
</html>
