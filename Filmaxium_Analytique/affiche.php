<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Encode+Sans:wght@400;700&display=swap">
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
    <title>Affichefilm</title>
</head>
<style>
    body {
        margin: auto;
        display: flex;
        flex-direction: column;
        background: linear-gradient(to bottom, #E4CD83, #FFFFFF) no-repeat;
        height:100vh;
        border-radius:25px;
    }

    .search-container {
        margin: 20px auto;
        text-align: center;
    }

    .search-input {
        padding: 10px;
        width: 90%;
        border: 1px solid #ccc;
        border-radius: 25px;
        font-size: 16px;
    }

    .result-container {
        margin: 20px auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
    }

    .movie-item {
        text-align: center;
        overflow: hidden;
        position: relative;
        transition: transform 0.3s ease-in-out;
    }

    .movie-item.clicked {
        transform: scale(1.4); /* Ajustez la valeur pour le niveau de zoom souhaité */
    }

    .movie-poster {
        max-width: 50%;
        height: auto;
    }
</style>
<body>
    <?php
    session_start();
    ?>
    <div class="rectangle2"></div>
    <div class="search-container">
        <input type="text" class="search-input" placeholder="Recherche de film..." id="searchQuery">
        <button onclick="searchMovies()">Rechercher</button>
    </div>
    <br>
    <br> 
    <div class="result-container" id="resultContainer"></div>

    <script>
       function searchMovies() {
    var searchQuery = document.getElementById('searchQuery').value;

    const settings = {
        async: true,
        crossDomain: true,
        url: `https://imdb8.p.rapidapi.com/title/v2/find?title=${searchQuery}&limit=20&titleType=movie,tvSeries`,
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '4af10acecamsh208e06566c5c57dp183d71jsnd3b78c58d16e',
            'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
        }
    };

    $.ajax(settings).done(function (response) {
        displayResults(response.results);
        console.log(response.results);
    });
}

function displayResults(movies) {
    var resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = '';

    if (movies) {
        movies.forEach(function (movie) {
            if (movie.image && movie.image.url) {
                var movieItem = document.createElement('div');
                movieItem.className = 'movie-item';
                movieItem.setAttribute('data-movie-id', movie.id); // Ajoutez l'ID du film comme attribut
                var moviePoster = document.createElement('img');
                moviePoster.src = movie.image.url;
                moviePoster.alt = movie.title;
                moviePoster.className = 'movie-poster';

                // Ajoutez l'événement de clic avec l'ID du film à l'affiche
                moviePoster.addEventListener('click', function () {
                    onMovieClick(movieItem);
                });

                movieItem.appendChild(moviePoster);
                resultContainer.appendChild(movieItem);
            }
        });
    } else {
        resultContainer.textContent = 'Aucun résultat trouvé.';
    }
}

function onMovieClick(movieItem) {
    var movieItems = document.querySelectorAll('.movie-item');
    var selectedMovieId = movieItem.getAttribute('data-movie-id');

    // Supprimez les 7 premiers caractères et le dernier caractère de l'ID du film
    var extractedId = selectedMovieId.slice(7, -1);

    if (extractedId) {
        movieItems.forEach(function (item) {
            item.classList.remove('clicked');
        });

        movieItem.classList.add('clicked');
        console.log(extractedId);
        $.ajax({
            type: 'POST',
            url: 'gestion_session.php',
            data: { movieId: extractedId },
            success: function (response) {
                console.log('ID du film enregistré dans la session avec succès.');
            },
            error: function (xhr, status, error) {
                console.error('Erreur lors de l\'enregistrement de l\'ID du film dans la session.');
                console.log('Status:', status);
                console.log('Error:', error);
            }
        });
    } else {
        console.error('Impossible d\'extraire l\'ID du film.');
    }
}
    </script>
</body>
</html>
