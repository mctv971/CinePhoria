<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="filmaxium.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Encode+Sans:wght@400;700&display=swap">
    <title>Analyse</title>
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

    <div>
        <h1>ANALYSE</h1>
    </div>   

    <div class="rectangles-container">
        <div class="rectangle">
            <div class="btn_analyse"><a href="comparer.php"><b>Comparer</b></a></div>
            <p>Cliquez sur Comparer pour accéder à une page de comparaison où de nombreux choix s’offrent à vous.</p>
        </div>
        <div class="rectangle">
            <div class="btn_analyse"><a href="recherche.php"><b>Fiche stats</b></a></div>
            <p>Cliquez sur Fiche Stats  pour accéder à la page statistique d’un film, d’un collaborateur, d’un genre</p>
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
