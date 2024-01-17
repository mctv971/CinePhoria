<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="filmaxium.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Encode+Sans:wght@400;700&display=swap">
    <title>Analyse - Recherche</title>
    <style>
        body {
            background-color: #191919;
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
            <a href="prediction.php">Prediction</a>
            <a href="stats.php">Stats</a>
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

    <div class="search-bar">
        <input type="text" placeholder="Rechercher...">
        <a class="return" href="analyse.php"><b>Retour</b></a>
    </div>

    <div class="columns">
        <ul><b>Film</b>
            <li><a href="fiche_stats.php">Élément 1</a></li>
            <li>Élément 2</li>
            <li>Élément 3</li>
        </ul>
        <ul><b>Collaborateur</b>
            <li><a href="fiche_stats.php">Élément 1</a></li>
            <li>Élément 2</li>
            <li>Élément 3</li>
        </ul>
        <ul><b>Genre</b>
            <li><a href="fiche_stats.php">Élément 1</a></li>
            <li>Élément 2</li>
            <li>Élément 3</li>
        </ul>
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