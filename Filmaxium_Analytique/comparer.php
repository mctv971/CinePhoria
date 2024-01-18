<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="filmaxium.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Encode+Sans:wght@400;700&display=swap">
    <title>Analyse - Comparer</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
    <style>
        body {
            background: linear-gradient(to bottom, #00113E, #697CA4) no-repeat;
            height: 100vh;
        }
        iframe {
            background: linear-gradient(to bottom, #E4CD83, #FFFFFF) no-repeat;
            width: 40%;
            height: 600px;
            border-radius: 25px;
            border: none;
            margin-top: 20px;
            margin-left: 20px;
        }
        .comparer {
            display: flex;
            justify-content: space-between;
        }
        .new-div {
    display: none;
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1; 
}

    </style>
</head>
<body>
    <?php session_start(); ?>
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
    <header>
        <nav class="nav-links2">
            <div class="nav-buttons2"><a href="#">Film</a></div>
            <div class="nav-buttons2"><a href="#">Collaborateur</a></div>
            <div class="nav-buttons2"><a href="#">Genre</a></div>
        </nav>
    </header>
    </div>
    <div class="comparer">
        <iframe src="affiche.php"></iframe>
        <div class="rectangle3">
            <a href="#" id="compare-button">Comparer</a>
        </div>
        <iframe style="margin-right:20px" src="affiche2.php"></iframe>
        <button id="scrollToTopBtn" onclick="scrollToTop()">Vers le haut</button>
        <iframe class="new-div" src="compareF.php"></iframe>
    </div>
    


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

        $(document).ready(function () {
    // Masquer l'élément .new-div au départ
    $(".new-div").hide();

    // Détection du changement dans les sélections de films
    $("#movieSelect1, #movieSelect2").on("change", function () {
        var selectedMovieId1 = $("#movieSelect1").val();
        var selectedMovieId2 = $("#movieSelect2").val();

        // Mettre à jour la source de l'iframe de travail avec les nouveaux identifiants
        var iframeSrc = "compareF.php?movieId1=" + selectedMovieId1 + "&movieId2=" + selectedMovieId2;
        $(".new-div iframe").attr("src", iframeSrc);
    });

    $("#compare-button").on("click", function () {
        $(".comparer iframe, .rectangle3").fadeOut("slow", function () {
            // La source de l'iframe de travail est déjà mise à jour lors du changement de sélections
            $(".new-div").fadeIn("slow");
            var windowHeight = $(window).height();
            var iframeHeight = $(".new-div iframe").height();
            var marginTop = (windowHeight - iframeHeight) / 2;
            $(".new-div iframe").css("margin-top", marginTop + "px");
        });
    });
});


</script>
