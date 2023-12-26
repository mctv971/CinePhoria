<!DOCTYPE html>
<html lang="fr">

    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="style.css">
        <title>Filmaxium</title>
    </head>

    <body>
        <div id="search-bar">
            <h1 onclick="location.reload()">Filmaxium</h1>
            <form id="search-form">
                <input type="text" id="search-input" placeholder="Recherche Filmaxium">
            </form>
        </div>
        <div>
            <h1 id="category-title">Découvrez</h1>
        </div>
        <div id="movies-grid"></div>
        <div id="footer">
            <p>Ce produit utilise l'API TMDB mais n'est ni approuvé ni certifié par TMDB.</p>
        </div>
        <script src="script.js"></script>
    </body>

</html>