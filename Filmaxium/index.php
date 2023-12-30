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
        <label for="genre-select">Choisissez un genre :</label>
        <select id="genre-select">
            <option value="">Tous les genres</option>
            <option value="28">Action</option>
            <option value="35">Comédie</option>
            <option value="12">Aventure</option>
            <option value="18">Drame</option>
            <option value="99">Documentaire</option>
            <option value="10751">Famille</option>
            <option value="14">Fantaisie</option>
            <option value="10759">Action & Aventure (Séries)</option>
            <option value="80">Crime (Séries)</option>
            <option value="16">Animation (Séries)</option>
        </select>
        
        <label for="media-type-select">Choisissez le type de média :</label>
        <select id="media-type-select">
            <option value="movie">Film</option>
            <option value="tv">Série TV</option>
        </select>
        <button onclick="handleGenreAndMediaTypeChange()">Filtrer</button>
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
