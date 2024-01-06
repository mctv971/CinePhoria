<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="filmaxium.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Encode+Sans:wght@400;700&display=swap">
    <title>Accueil</title>
        <style>
            body {
                background: linear-gradient(to bottom, #00113E, #697CA4) no-repeat;
            }
        </style>
</head>
<body>

     <header>
        <div>
            <a id="logo" href="analytique_accueil.php"><img src="img/logo.png" alt="Logo"></a>
        </div>
        <nav class="nav-links">
            <a href="analyse.php">Analyse</a>
            <a href="#">Prediction</a>
            <a href="#">Stats</a>
        </nav>
        <div class="nav-buttons">
            <a href="#"><img src="img/films.png" alt="Films btn"></a>
            <div class="dropdown">
                <a href="#"><img src="img/profile.png" alt="Profile btn"></a>
                <div class="dropdown-content">
                    <a href="#">Mon profil</a>
                    <a href="#">Paramètres</a>
                    <a href="#">Déconnexion</a>
                </div>
            </div>
        </div>
    </header>

    <div class="bg_img">
        <img src="img/machine-learning-statistics-header.jpg" alt="Bienvenue Image">
    </div>
    <div class="bg_img_txt">
        <h1>FILMAXIUM : ANALYTICS</h1>
        <h1>Explorez les statistiques qui racontent l'histoire derrière chaque film</h1>
    </div>   

    <div class="columns">
        <div class="column">
            <p class="l_blue"><b>LE CINÉMA EN CHIFFRES</b></p><p class="l_blue">Découvrez le cinéma sous un nouvel angle grâce à notre page d'Analyse de Données et Comparaison. Explorez les coulisses de l'industrie cinématographique à travers des données approfondies. Notre système de comparaison unique vous permet de personnaliser vos analyses en comparant films, acteurs, réalisateurs, et bien plus encore. Venez explorer le cinéma de manière interactive et analytique</p>
        </div>
        <div class="column">
            <p class="l_blue"><b>PRÉDIRE LE CINÉMA</b></p><p class="l_blue">Le cinéma n'est pas seulement une question de passif, il s'agit aussi de prédire l'avenir. Notre page de Prédiction et Prévision cinématographiques vous emmène dans le monde excitant de la data science cinématographique. Nous utilisons des modèles de machine learning pour anticiper les succès à venir, analyser les tendances, et prévoir l'impact des acteurs, des réalisateurs et des autres variables. Découvrez comment la science des données transforme la manière dont nous envisageons le cinéma et participez à la prédiction du futur cinématographique.</p>
        </div>
        <div class="column">
            <p class="l_blue"><b>COMPRENDRE LE CINÉMA</b></p><p class="l_blue">Le cinéma est un art, mais il est également un terrain fertile pour les tests statistiques. Notre page de Tests Statistiques cinématographiques vous invite à explorer les relations complexes entre différentes variables du monde du cinéma. Que ce soit pour tester la corrélation entre la présence d'un top acteur et la recette d'un film, ou pour analyser les données d'une manière inédite, nous mettons en lumière la puissance de la statistique dans l'industrie cinématographique. Découvrez comment la science des données révèle les secrets du cinéma.</p>
        </div>
    </div>

<button id="scrollToTopBtn" onclick="scrollToTop()">Vers le haut</button>

<script>
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    window.onscroll = function() {
        var scrollToTopBtn = document.getElementById("scrollToTopBtn");
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    };
</script>

</body>
</html>
