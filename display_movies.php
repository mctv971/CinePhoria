<?php
session_start();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="./assets/css/style.css">
    <script src="./assets/js/global.js" defer></script>
    <script src="./assets/js/index.js" type="module"></script>
    <title>Affichage des Films</title>
</head>
<body style="background:var(--background);">
<div id="cards-container"></div>
<script type="module">
    import { displayMovieCards } from './assets/js/movie-card.js';
    document.addEventListener('DOMContentLoaded', () => {
        const imdbIds = <?php echo json_encode(explode(',', $_SESSION['imdb_ids'])); ?>;
        displayMovieCards(imdbIds);
    });
</script>
<a id="btnDisplay" href="quizzgpt.php?reset=true">Réinitialiser le quiz</a>
<div class="iframeContainer">
      <iframe id="iframe"></iframe>
      <img src="./assets/images/close.png" alt="Iframe Close" class="closeIcon" id="closeIconGen">
</div>

</body>
</html>
