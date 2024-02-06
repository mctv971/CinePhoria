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
        transform: scale(1.27); /* Ajustez la valeur pour le niveau de zoom souhaité */
    }

    .movie-poster {
        max-width: 50%;
        height: auto;
    }
</style>
<body>
    <?php session_start(); ?>
    <div class="rectangle2"></div>
    <div class="search-container">
        <input type="text" class="search-input" placeholder="Recherche de film ou série..." id="searchQuery" oninput="searchMedia()">
    </div>
    <br>
    <br> 
    <div class="result-container" id="resultContainer"></div>

    <script>
        function searchMedia() {
            var searchQuery = document.getElementById('searchQuery').value;

            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjVlNWQ5OTUxYTdiNzg0ZTZkMDBjZjk3OGU4YjcyYyIsInN1YiI6IjY1Mzc3YzIxYzUwYWQyMDEyZGY0YjI2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jMOywP2uIuyrtnbX0kYWNkbGf0wTMUnNmKsFrNhcVXU'
                }
            };

            // Déterminer le type de média en fonction de l'URL
            var mediaType = window.location.href.includes('search/tv') ? 'tv' : 'movie';

            var movieUrl = `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=1`;
            var tvUrl = `https://api.themoviedb.org/3/search/tv?query=${searchQuery}&include_adult=false&language=en-US&page=1`;

            var moviePromise = fetch(movieUrl, options)
                .then(response => response.json());

            var tvPromise = fetch(tvUrl, options)
                .then(response => response.json());

            Promise.all([moviePromise, tvPromise])
                .then(results => {
                    var combinedResults = results.flatMap(result => result.results);
                    displayResults(combinedResults);
                })
                .catch(err => console.error(err));
        }

        function displayResults(media) {
    var resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = '';

    if (media.length > 0) {
        media.forEach(function (item) {
            if (item.poster_path) {
                var mediaItem = document.createElement('div');
                mediaItem.className = 'movie-item';
                mediaItem.setAttribute('data-media-id', item.id);

                // Vérifier la présence de la propriété original_title pour les films et origin_country pour les séries TV
                var mediaType = 'unknown';
                if (item.original_title) {
                    mediaType = 'movie';
                } else if (item.origin_country) {
                    mediaType = 'tv';
                }

                mediaItem.setAttribute('data-media-type', mediaType);
                var mediaPoster = document.createElement('img');
                mediaPoster.src = `https://image.tmdb.org/t/p/w500/${item.poster_path}`;
                mediaPoster.alt = item.title || item.name;
                mediaPoster.className = 'movie-poster';

                mediaPoster.addEventListener('click', function () {
                    onMediaClick(mediaItem);
                });

                mediaItem.appendChild(mediaPoster);
                resultContainer.appendChild(mediaItem);

                console.log('Titre:', item.title || item.name);
                console.log('ID:', item.id);
                console.log('Type de média:', mediaType);
                console.log('Date de sortie:', mediaType === 'tv' ? item.first_air_date : item.release_date);
                console.log('Vue d\'ensemble:', item.overview);
                console.log('-------------');
            }
        });
    } else {
        resultContainer.textContent = 'Aucun résultat trouvé.';
    }
}



        function onMediaClick(mediaItem) {
            var mediaItems = document.querySelectorAll('.movie-item');
            var selectedMediaId = mediaItem.getAttribute('data-media-id');
            var selectedMediaType = mediaItem.getAttribute('data-media-type');

            if (selectedMediaId && selectedMediaType) {
                mediaItems.forEach(function (item) {
                    item.classList.remove('clicked');
                });

                mediaItem.classList.add('clicked');
                console.log(selectedMediaId);
                console.log(selectedMediaType);

                $.ajax({
                    type: 'POST',
                    url: 'gestion_session.php',
                    data: {
                        mediaId: selectedMediaId,
                        mediaType: selectedMediaType
                    },
                    success: function (response) {
                        console.log('ID du média enregistré dans la session avec succès.');
                    },
                    error: function (xhr, status, error) {
                        console.error('Erreur lors de l\'enregistrement de l\'ID du média dans la session.');
                        console.log('Status:', status);
                        console.log('Error:', error);
                    }
                });
            } else {
                console.error('Impossible d\'extraire l\'ID du média ou le type de média.');
            }
        }
    </script>
</body>
</html>
