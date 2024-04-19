<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="Accueil.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500&display=swap" rel="stylesheet">
    <title>Filmaxium </title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="assets/js/formulaire.js"></script>
</head>
<?php
$username = $_GET['username'];
?>
<body class="pageformulaire">
    <div class="logo">
        <a href="inscription.php"><img src="../images/logo.png" alt="Logo"></a>
    </div>
    <div class="info-text">
        <p>Entres tes informations ! Les plateformes vont nous permettre d'afficher le contenu dont tu as accès</p>
    </div>
    <div class="photo-input2">
        <label for="photoInput">
            <img src="../images/place.jpg" id="photoPreview" class="photo-preview">
        </label>
        <input type="file" id="photoInput" accept="image/*" style="display: none;">
    </div>
    <div class="containerformulaire">
        <form method="post" id="inscriptionForm">
            <div class="input-group">
                <input type="hidden" name="username" id="username" value="<?php echo $username; ?>">
                <label for="nom">Nom :</label>
                <input type="text" id="nom" name="nom" placeholder="Entre ton nom" required>
                <label for="prenom">Prenom :</label>
                <input type="text" id="prenom" name="prenom" placeholder="Entre ton prenom" required>
                <label for="mail">Adresse mail :</label>
                <input type="email" id="mail" name="mail" placeholder="Entre ton mail" required>
                <label for="naissance">Date de naissance :</label>
                <input type="date" id="naissance" name="naissance" placeholder="Entre ta date de naissance" required>
                <label for="pays">Pays :</label>
                <select id="pays" name="pays" required>
                    <option value="fr">Français</option>
                    <option value="en">Anglais</option>
                    <option value="de">Allemand</option>
                    <option value="es">Espagnol</option>
                    <option value="ar">Arabe</option>
                </select><br>
                <label for="password">Mot de passe :</label>
                <input type="password" id="password" name="password" placeholder="Entre ton mot de passe" required>
                <label for="confirmPassword">Confirme ton mot de passe :</label>
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirme ton mot de passe" required>
            </div>
            <p>Plateformes possédées :</p>
            <div class="icones">
            <img src="../images/image 1.png" alt="Logo Netflix" class="icon" data-platform-id="8">
            <img src="../images/image 2.png" alt="Logo Disney+" class="icon" data-platform-id="337">
            <img src="../images/image 3.png" alt="Logo CrunchyRoll" class="icon" data-platform-id="283">
            <img src="../images/image 4.png" alt="Logo AppleTV" class="icon" data-platform-id="2">
            <img src="../images/image 5.png" alt="Logo PrimeVideo" class="icon" data-platform-id="9">

            </div>
            <button type="submit" id="submitButton" class="arrow-button">
                <img src="../images/Bouton.png" alt="Flèche" id="arrowButton" class="arrow-button">
            </button>
        </form>
    </div>
</body>
</html>
