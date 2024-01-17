<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="filmaxium.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Encode+Sans:wght@400;700&display=swap">
    <title>Analyse - Fiche stats</title>
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

    <div id="movie-container">

        <img id="movie-poster" src="img/la_haine.jpg" alt="Movie Poster">

        <p class="text_left">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae metus nec nisl efficitur consequat.
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Integer quis mauris a justo gravida vulputate ut nec nunc.
        </p>

        <div id="separator"></div>

        <h1>(Variable...)</h1>

        <img id="centered-image" src="img/graph.png" alt="Centered Image">
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
