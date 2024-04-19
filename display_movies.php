<?php
session_start();
if (!isset($_SESSION['imdb_ids'])) {
    header("Location: index.php"); // Redirigez si aucun ID IMDb n'est trouvé
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./assets/css/style.css">
    <title>Affichage des Films</title>
</head>
<body>
<div id="cards-container"></div>
<script type="module">
    import { displayMovieCards } from './assets/js/movie-card.js';
    document.addEventListener('DOMContentLoaded', () => {
        const imdbIds = <?php echo json_encode(explode(',', $_SESSION['imdb_ids'])); ?>;
        displayMovieCards(imdbIds);
    });
</script>
</body>
</html>
