<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500&display=swap" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="Accueil.css">
    <title>Filmaxium</title>
</head>

<body class="Presentation">
    <img src="../images/Ecran.png" alt="Ecran de télévision" class="ecran" />
    <p id="TitreP">Bonjour et bienvenue sur Filmaxium.</p>
    <img src="../images/Bouton.png" alt="Bouton Droite" class="bouton-droite" onclick="maFonction()" />
    <img src="../images/BoutonGauche.png" alt="Bouton Gauche" class="bouton-gauche" onclick="maFonctionGauche()" />
   <a href="inscription.php"> <img src="../images/BoutonHaut.png" alt="Bouton Haut" class="top-link" /></a>

    <script>
        var etat = 0; // 0 pour l'état initial, 1 pour le premier changement, 2 pour le message d'Analytics, 3 pour "Venez nous rejoindre"
        var titreInitial = document.getElementById("TitreP").innerHTML; // Sauvegarder le titre initial
    
        function maFonction() {
            var titre = document.getElementById("TitreP");
            var boutonGauche = document.querySelector('.bouton-gauche');
    
            if (etat === 0) {
                // Premier changement
                titre.innerHTML = '<div style="display: flex; align-items: start;"><img src="../images/logo.png" alt="Logo" style="margin-right:20px; margin-left:20px; width:300px;"><p style="font-size: 0.8em;">Nous sommes une plateforme regroupant:<br/> -Films, séries, animés <br/> -Acteurs, réalisateurs <br/> -Bandes annonces, Cinémas</p></div>';
                boutonGauche.style.display = 'block';
                etat = 1;
            } else if (etat === 1) {
                // Message d'Analytics
                titre.innerHTML = '<div style="display: flex; align-items: start;"><img src="../images/Analytic.png" alt="Analytics Logo" style="margin-right:20px; margin-left:20px; width:300px;"><p style="font-size: 0.8em;">Mais également une partie Analytics :<br/> -Comparaison <br/> -Prediction <br/> -Test Statistique</p></div>';
                etat = 2;
            } else if (etat === 2) {
                // Message "Venez nous rejoindre" avec deux logos
                titre.innerHTML = '<div style="text-align: center; margin-bottom: 20px;">Venez nous rejoindre</div><div style="display: flex; justify-content: space-between;"><img src="../images/logo.png" alt="Logo 1" style="margin-right:20px; margin-left:20px; width:300px;"><img src="../images/Analytic.png" alt="Logo 2" style="margin-right:20px; margin-left:20px; width:300px;"></div>';
                etat = 3;
            } else {
                // Revenir au titre initial
                titre.innerHTML = titreInitial;
                boutonGauche.style.display = 'none';
                etat = 0;
            }
        }
    
        function maFonctionGauche() {
            if (etat > 0) {
                etat--; // Décrémenter l'état pour revenir à l'état précédent
                maFonction(); // Appeler maFonction pour mettre à jour l'affichage selon le nouvel état
            }
        }      
    </script>
    
    
    
    
    
</body>
</html>
