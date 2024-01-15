<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="filmaxium.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Encode+Sans:wght@400;700&display=swap">
    <title>Analyse - Comparer</title>
    <style>
        body {
            background: linear-gradient(to bottom, #00113E, #697CA4) no-repeat;
        }
    </style>
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
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
    <header>
        <nav class="nav-links2">
            <div class="nav-buttons2"><a href="#">Film</a></div>
            <div class="nav-buttons2"><a href="#">Collaborateur</a></div>
            <div class="nav-buttons2"><a href="#">Genre</a></div>
        </nav>
    </header>
    </div>

    <div class="rectangles-container">
        <div class="rectangle2">
            <div class="search-bar2">
                <input type="text" id="comparison-input" placeholder="Rechercher...">
            </div>
            <p style="margin: 20%;"></p>
            <ul id="search-results-list"></ul>
        </div>
        <div class="rectangle3">
            <a href="#" id="compare-button">Comparer</a>
        </div>
        <div class="rectangle2">
            <div class="search-bar2">
                <input type="text" id="comparison-input-2" placeholder="Rechercher...">
            </div>
            <p style="margin: 20%;"></p>
            <ul id="search-results-list-2"></ul>
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

        // Utilisez l'événement input pour déclencher la recherche lors de la modification de l'input
        $('#comparison-input').on('input', function () {
            var query = $(this).val();
            fetchData(query, 'search-results-list');
        });

        $('#comparison-input-2').on('input', function () {
            var query = $(this).val();
            fetchData(query, 'search-results-list-2');
        });

        async function fetchData(query, listId) {
            const url = `https://imdb8.p.rapidapi.com/title/find?q=${query}`;
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '8cc2cf9290mshe7b85af954aa563p182979jsnfe362503c6de',
                    'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
                }
            };

            try {
                const response = await fetch(url, options);
                const result = await response.json(); 
                console.log(result);

                displaySearchResults(result.results, listId);
            } catch (error) {
                console.error(error);
            }
        }

        function displaySearchResults(results, listId) {
            // Supprimez les anciens résultats de la liste
            $('#' + listId).empty();

            // Ajoutez les nouveaux résultats à la liste
            results.forEach(function (result) {
                // Vérifiez si result.image et result.titleType sont définis, et si result.titleType est 'movie' ou 'series'
                if (result.image && result.titleType && (result.titleType.toLowerCase() === 'movie' || result.titleType.toLowerCase() === 'series')) {
                    // Créez un élément img pour chaque URL d'image
                    var imgElement = $('<img>').attr('src', result.image.url).attr('alt', result.title).addClass('search-result-image');
                    var listItem = $('<li>').append(imgElement);

                    // Ajoutez l'élément à la liste
                    $('#' + listId).append(listItem);
                }
            });
        }
    </script>
</body>
</html>
