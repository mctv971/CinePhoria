<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>Filmaxium</title>
    <a href="profil.php"><img class="logo" src="img/profil.png" alt="Profil"></a>
</head>

<body>
    <div id="search-bar">
        <h1 onclick="location.reload()">Filmaxium</h1>
        <form id="search-form">
            <input type="text" id="search-input" placeholder="Recherche Filmaxium">
            <button type="submit">Rechercher</button>
        </form>
    </div>
    
    <div id="genre-filters">
        <a href="#" onclick="fetchMoviesAndTVShowsByGenre(28, 'movie');">Action</a>
        <a href="#" onclick="fetchMoviesAndTVShowsByGenre(35, 'movie');">Comédie</a>
        <a href="#" onclick="fetchMoviesAndTVShowsByGenre(12, 'movie');">Aventure</a>
        <a href="#" onclick="fetchMoviesAndTVShowsByGenre(18, 'movie');">Drame</a>
        <a href="#" onclick="fetchMoviesAndTVShowsByGenre(99, 'movie');">Documentaire</a>
        <a href="#" onclick="fetchMoviesAndTVShowsByGenre(10751, 'movie');">Famille</a>
        <a href="#" onclick="fetchMoviesAndTVShowsByGenre(14, 'movie');">Fantaisie</a>
        <a href="#" onclick="fetchMoviesAndTVShowsByGenre(10759, 'tv');">Action & Aventure (Séries)</a>
        <a href="#" onclick="fetchMoviesAndTVShowsByGenre(80, 'tv');">Crime (Séries)</a>
        <a href="#" onclick="fetchMoviesAndTVShowsByGenre(16, 'tv');">Animation (Séries)</a>
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
