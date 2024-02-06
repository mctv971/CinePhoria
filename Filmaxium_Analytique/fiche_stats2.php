<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="filmaxium.css">
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Encode+Sans:wght@400;700&display=swap">
    <title>Analyse - Fiche stats</title>

    <style>
        body {
            background: linear-gradient(to bottom, #00113E, #697CA4) no-repeat;
            margin: 0;
            font-family: 'Encode Sans', sans-serif;
            height: 100%;
        }

        .stats-container {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            flex-wrap: wrap;
        }

        .profile-section {
            margin: 20px;
            padding: 20px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 10px;
            text-align: left;
            color: black;
            max-width: 700px;
            width: 200px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .info-section {
            margin: 20px;
            padding: 20px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 10px;
            text-align: left;
            color: black;
            max-width: 950px;
            flex: 1;
        }

        .profile-section img {
            max-width: 100%;
            border-radius: 10px;
            margin-bottom: 10px;
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

    <?php
    $movieId = isset($_GET['id']) ? $_GET['id'] : null;
    ?>

    <div class="stats-container">
        <div class="profile-section" id="profile-container"></div>
        <div class="info-section" id="biography-container"></div>
    </div>

    <button id="scrollToTopBtn" onclick="scrollToTop()">Vers le haut</button>

    <script>
        let imdbid;

        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjVlNWQ5OTUxYTdiNzg0ZTZkMDBjZjk3OGU4YjcyYyIsInN1YiI6IjY1Mzc3YzIxYzUwYWQyMDEyZGY0YjI2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jMOywP2uIuyrtnbX0kYWNkbGf0wTMUnNmKsFrNhcVXU'
            }
        };

        fetch('https://api.themoviedb.org/3/person/<?php echo $movieId ?>?language=fr', options)
            .then(response => response.json())
            .then(data => displayPersonInfo(data))
            .catch(err => console.error(err));

        function displayPersonInfo(personInfo) {
            const profileContainer = document.getElementById('profile-container');
            const biographyContainer = document.getElementById('biography-container');

            imdbid = personInfo.imdb_id;
            console.log(imdbid);
            
            const profileContent = `
                <img src="https://image.tmdb.org/t/p/w200${personInfo.profile_path}" alt="${personInfo.name}">
                <h2>${personInfo.name}</h2>
                <p><strong>Date de naissance:</strong> ${personInfo.birthday}</p>
                <p><strong>Lieu de naissance:</strong> ${personInfo.place_of_birth}</p>
                <p><strong>Popularité:</strong> ${personInfo.popularity}</p>
            `;

            profileContainer.innerHTML = profileContent;

            const biographyContent = `
                <p>${personInfo.biography}</p>
            `;

            biographyContainer.innerHTML = biographyContent;
        }
    </script>
</body>

</html>
