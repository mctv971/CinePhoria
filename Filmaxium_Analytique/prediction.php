<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="filmaxium.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Encode+Sans:wght@400;700&display=swap">
    <title>Prédiction</title>
    <style>
        body {
            background: linear-gradient(to bottom, #00113E, #697CA4) no-repeat;
        }
    </style>
</head>
<body>

<header>
    <div>
        <a id="logo" href="analytique_accueil.php"><img src="img/logo.png" alt="Logo"></a>
    </div>
    <nav class="nav-links">
        <a href="analyse.php">Analyses</a>
        <a href="prediction.php">Prédictions</a>
        <a href="stats.php">Statistiques</a>
    </nav>
    <div class="nav-buttons">
        <a href="#"><img src="img/films.png" alt="Films btn"></a>
        <div class="dropdown">
                <a><img src="img/profile.png" alt="Profile btn"></a>
            <div class="dropdown-content">
                <a href="#">Mon profil</a>
                <a href="#">Paramètres</a>
                <a href="#">Déconnexion</a>
            </div>
        </div>
    </div>
</header>

<div>
    <h1>PRÉDICTIONS</h1>
</div>   

<div class="column">
    <p class="l_blue"><b>Bienvenue sur notre page de prédiction cinématographique !</b></p>
    <p class="l_blue">Vous êtes un amateur de cinéma passionné ou simplement curieux de connaître les futures réussites du grand écran? Vous êtes au bon endroit! 
    <br />Notre page vous offre une expérience unique pour anticiper le succès des films, leurs récompenses et les tendances à venir dans l'industrie du cinéma.</p>
</div>

<div class="search-bar">
        <p style="text-align: center; color: #c2ced1; font-weight: bold;">Choisir un film/série : </p>
        <input type="text" placeholder="Rechercher...">
</div>

<div class="dropdown-container">
    <label for="testDropdown">Choisir un test :</label>
    <select id="testDropdown" onchange="updateTestText()">
        <option value="test1">Test 1</option>
        <option value="test2">Test 2</option>
        <option value="test3">Test 3</option>
    </select>
</div>

<div class="rectangles-container">
    <div class="rectangle4" id="testTextContainer">
        <p><b>Test 1 : Réussite d'un film </b></p><p><br>Vous avez toujours voulu savoir si un film allait cartonner au box-office ? Notre outil de prédiction 'Réussite d'un film' est là pour vous aider à décrypter les signes du succès. Entrez le titre du film que vous avez en tête, et laissez notre algorithme analyser les données pour vous donner une idée de son potentiel à l'écran.</p>
        <p><a href='test1.html' onclick='chooseTest(1)' class="choisir-hover"><b>Choisir ce test</b></a></p>
    </div>
</div> 

<div id="returnBtn">
    <a href="analytique_accueil.html">Retour</a>
</div>

<script>
    function updateTestText() {
        var testDropdown = document.getElementById("testDropdown");
        var selectedTest = testDropdown.value;
        var testTextContainer = document.getElementById("testTextContainer");
        var choisirCeTestLink = testTextContainer.querySelector("a");

        switch (selectedTest) {
            case "test1":
                testTextContainer.innerHTML = "<p><b>Test 1 : Réussite d'un film </b></p><p><br>Vous avez toujours voulu savoir si un film allait cartonner au box-office ? Notre outil de prédiction 'Réussite d'un film' est là pour vous aider à décrypter les signes du succès. Entrez le titre du film que vous avez en tête, et laissez notre algorithme analyser les données pour vous donner une idée de son potentiel à l'écran.</p><p><a href='test1.html' onclick='chooseTest(1)' class='choisir-hover'>Choisir ce test</a></p>";
                break;
            case "test2":
                testTextContainer.innerHTML = "<p><b>Test 2 : Récompenses d'un film </b></p><p><br>Les prix et récompenses dans le monde du cinéma sont un indicateur essentiel de la qualité d'un film. Utilisez notre test 'Récompenses d'un film' pour découvrir quels films seront honorés lors de la prochaine saison des récompenses. Est-ce que votre film favori sera sur le devant de la scène?</p><p><a href='test2.html' onclick='chooseTest(2)' class='choisir-hover'>Choisir ce test</a></p>";
                break;
            case "test3":
                testTextContainer.innerHTML = "<p><b>Test 3 : Tendances dans l'industrie </b></p><p><br>Le cinéma évolue constamment, et les tendances dans l'industrie sont en perpétuel changement. Notre test 'Tendances dans l'industrie' vous permet de plonger dans le futur du cinéma en prédisant les genres, les styles, et les sujets qui deviendront populaires. Soyez à l'avant-garde de l'industrie cinématographique !</p><p><a href='test3.html' onclick='chooseTest(3)' class='choisir-hover'>Choisir ce test</a></p>";
                break;
            default:
                testTextContainer.innerHTML = "";
        }
    }

    // Fonction pour choisir le test
    function chooseTest(testNumber) {
        // Ajoutez votre logique pour le choix du test ici
        console.log("Test choisi :", testNumber);
    }

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
</script>

<button id="scrollToTopBtn" onclick="scrollToTop()">Vers le haut</button>

</body>
</html>
