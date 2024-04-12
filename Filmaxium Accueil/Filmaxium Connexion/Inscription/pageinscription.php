<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="Accueil.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500&display=swap" rel="stylesheet">
    <title>Filmaxium </title>
</head>
<body class="pageinscription">
    <a href="inscription.html">  
        <img src="../images/logo.png" alt="Logo">
    </a>

    <div class="inscription-container">
        <p id="inscriptionText" style="display:none;">Bienvenue sur la page d'inscription de la Plateforme Filmaxium.</p>
        <p id="assistantText" style="display:none;">Je vais être ton assistant tout au long de ton aventure !</p>
        <p id="guideText" style="display:none;">Pour avancer ton inscription, lorsque cela sera possible, appuie sur la flèche !</p>
        <input type="text" id="usernameInput" style="display:none;" placeholder="Entrez votre username">  <br /> 
        <p id="usernamePrompt" style="display:none;">Oups! J'ai totalement oublié de me présenter, je suis ton assistant et toi ?<br />(Entres ton username)</p>
    </div>

    <a href="formulaire.php?username=">
    <img src="../images/Bouton.png" alt="Flèche" id="arrowButton" class="arrow-button" style="display:none;">
    </a>

    
    <script>
        document.getElementById('arrowButton').addEventListener('click', function() {
        var usernameInput = document.getElementById('usernameInput').value; // Obtenir la valeur de l'entrée de texte
        var usernameLink = document.querySelector('a[href="formulaire.php?username="]'); // Sélectionner le lien

        // Mettre à jour l'URL avec la valeur du username
        usernameLink.href = "formulaire.php?username=" + encodeURIComponent(usernameInput);

        var usernamePrompt = document.getElementById('usernamePrompt');
        var arrowButton = document.getElementById('arrowButton');

        // Faire apparaître les éléments après un clic sur le bouton
        usernameInput.style.display = 'block';
        usernamePrompt.style.display = 'block';
        // Vous pouvez ajouter d'autres inputs ici

        // Masquer le bouton après qu'il ait été cliqué
        arrowButton.style.display = 'none';
    });
        document.getElementById('arrowButton').addEventListener('click', function() {
            var usernameInput = document.getElementById('usernameInput');
            var usernamePrompt = document.getElementById('usernamePrompt');
            var arrowButton = document.getElementById('arrowButton');

            // Faire apparaître les éléments après un clic sur le bouton
            usernameInput.style.display = 'block';
            usernamePrompt.style.display = 'block';
            // Vous pouvez ajouter d'autres inputs ici

            // Masquer le bouton après qu'il ait été cliqué
            arrowButton.style.display = 'none';
        });
        
        // Faire apparaître la première phrase après un délai initial
        setTimeout(function() {
            document.getElementById('inscriptionText').style.display = 'block';
        }, 0);

        // Faire disparaître la première phrase après un délai
        setTimeout(function() {
            document.getElementById('inscriptionText').style.display = 'none';
            // Faire apparaître la deuxième phrase après que la première phrase ait disparu
            document.getElementById('assistantText').style.display = 'block';
        }, 2000);

        // Faire disparaître la deuxième phrase après un délai
        setTimeout(function() {
            document.getElementById('assistantText').style.display = 'none';
            // Faire apparaître la troisième phrase après que la deuxième phrase ait disparu
            document.getElementById('guideText').style.display = 'block';
            // Faire disparaître la troisième phrase après un délai
            setTimeout(function() {
                document.getElementById('guideText').style.display = 'none';
                // Faire apparaître l'input et le bouton après que la troisième phrase ait disparu
                document.getElementById('usernameInput').style.display = 'block';
                document.getElementById('usernamePrompt').style.display = 'block';
                document.getElementById('arrowButton').style.display = 'block';
            }, 2000);
        }, 4000);
        
    </script>
</body>
</html>