<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="filmaxium.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Encode+Sans:wght@400;700&display=swap">
    <title>Tests statistiques</title>
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
    <h1>TESTS STATISTIQUES</h1>
</div>   

<div class="column">
    <p class="l_blue"><b>Bienvenue sur notre page de tests statistiques cinématographiques !</b></p>
    <p class="l_blue">Découvrez l'univers cinématographique grâce à notre plateforme de tests statistiques exclusifs. <br>Explorez les relations entre les divers variables clés disponibles. Ces analyses offrent des perspectives précieuses pour les décideurs du divertissement. </br>Que vous soyez un passionné ou un professionnel du cinéma, plongez dans notre arsenal d'outils pour décoder les mystères du septième art.</br> Bienvenue dans le futur des statistiques cinématographiques !</p>
</div>

<div class="search-bar">
        <p style="text-align: center; color: #c2ced1; font-weight: bold;">Choisir un film/série : </p>
        <input type="text" placeholder="Rechercher...">
</div>

<div class="dropdown-container">
    <label for="testDropdown"></label>
    <select id="testDropdown" onchange="updateTestTextAndLink()">
        <option>Choisir un test :</option>
        <option value="test1">Test Anova (analyse de la variance)</option>
        <option value="test2">Test de corrélation de Pearson</option>
        <option value="test3">Test de Student</option>
    </select>
</div>

<div class="dropdown-container2">
    <div>
        <label for="variable1Dropdown"></label>
        <select id="variable1Dropdown" onchange="updateVariableTextAndLink(1)">
            <option>Choisir la variable 1 :</option>
            <option value="Recette">Recette</option>
            <option>Note critique</option>
            <option>Durée</option>
            <option>Budget de production</option>            
        </select>
    </div>
    <div class="vertical-bar"></div> 
    <div>
        <label for="variable2Dropdown"></label>
        <select id="variable2Dropdown" onchange="updateVariableTextAndLink(2)">
            <option>Choisir la variable 2 :</option>
            <option value="Recette">Recette</option>
            <option>Note critique</option>
            <option>Durée</option>
            <option>Budget de production</option> 
        </select>
    </div>
</div>

<div class="rectangles-container">
    <div class="rectangle5" id="testTextContainer">
        <p><span id="testChosen">Test choisi : </span></p>
        <p><span id="variable1Chosen">Variable 1 choisie : </span></p>
        <p><span id="variable2Chosen">Variable 2 choisie : </span></p>
        <p><a id="testStatLink" href="#"><b>Effectuer le test</b></a></p>
    </div>
</div> 

<div id="returnBtn">
    <a href="analytique_accueil.html">Retour</a>
</div>

<script>
    function updateTestTextAndLink() {
        var testDropdown = document.getElementById("testDropdown");
        var selectedTest = testDropdown.value;
        var testTextContainer = document.getElementById("testChosen");
        var testStatLink = document.getElementById("testStatLink");

        switch (selectedTest) {
            case "test1":
                testTextContainer.textContent = "Test choisi : Test Anova (analyse de la variance)";
                break;
            case "test2":
                testTextContainer.textContent = "Test choisi : Test de corrélation de Pearson";
                break;
            case "test3":
                testTextContainer.textContent = "Test choisi : Test de Student";
                break;
            default:
                testTextContainer.textContent = "";
        }

        updateLink();
    }

    function updateVariableTextAndLink(variable) {
        var variableTextContainer = document.getElementById("variable" + variable + "Chosen");
        var variableDropdown = document.getElementById("variable" + variable + "Dropdown");
        var selectedVariable = variableDropdown.value;

        variableTextContainer.textContent = "Variable " + variable + " choisie : " + selectedVariable;

        updateLink();
    }

    function updateLink() {
        var testDropdown = document.getElementById("testDropdown");
        var variable1Dropdown = document.getElementById("variable1Dropdown");
        var variable2Dropdown = document.getElementById("variable2Dropdown");
        var testStatLink = document.getElementById("testStatLink");

        if (testDropdown.value && variable1Dropdown.value && variable2Dropdown.value) {
            testStatLink.href = "teststat.html";
            testStatLink.style.display = "block";
        } else {
            testStatLink.href = "#";
            testStatLink.style.display = "none";
        }
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
