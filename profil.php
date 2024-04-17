<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="Filmaxium Accueil/Filmaxium Connexion/Inscription/Accueil.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500&display=swap" rel="stylesheet">
    <title>Filmaxium</title>
</head>
<body class="monprofil">

<?php
session_start();

if (!isset($_SESSION['client'])){

    header("Location : connexion.php ");
    exit();
}


$client = $_SESSION['client'];
require("assets/php/bd.php");

// Récupère l'ID utilisateur à partir de la session.
$userId = $_SESSION['client']['id_user'];
$bdd = getBD(); // Obtient une instance de connexion à la base de données.

// Prépare une requête SQL pour récupérer les favoris avec leur type pour l'utilisateur.
$queryFavoris = "SELECT imdb_id, id_type FROM Favoris WHERE id_user = :id_user";
$stmtFavoris = $bdd->prepare($queryFavoris);
$stmtFavoris->bindParam(':id_user', $userId);

// Exécute la requête et gère les erreurs potentielles.
if (!$stmtFavoris->execute()) {
    echo json_encode(array('error' => 'Erreur lors de l\'exécution de la requête SQL pour les favoris'));
    exit();
}

// Récupère les résultats sous forme de tableau associatif.
$favoris = $stmtFavoris->fetchAll(PDO::FETCH_ASSOC);

// Prépare les données pour JavaScript
$items = array_map(function ($item) {
    return ['id' => $item['imdb_id'], 'type' => $item['id_type']];
}, $favoris);

?>
    
    <!-- Conteneur flex pour la photo et le formulaire -->
    <div class="containerflex">
        <div class="logomp">
            <a href="Filmaxium Accueil/Filmaxium Connexion/Inscription/inscription.html"><img src="Filmaxium Accueil/Filmaxium Connexion/images/logo.png" alt="Logo"></a>
        </div>
        <!-- Photo de profil -->
        <div class="photo-input">
            <label for="photoInput">
                <img src="Filmaxium Accueil/Filmaxium Connexion/images/place.jpg" id="photoPreview" class="photo-preview">
            </label>
            <input type="file" id="photoInput" accept="image/*" style="display: none;">
        </div>
        <!-- Formulaire -->
        <form class="containerformulaire2">
            <div class="input-group">
                <label for="nom">Nom :</label>
                <input type="text" id="nom" name="nom" value="<?php echo $client['nom']; ?>" readOnly="readOnly">
                <label for="prenom">Prénom :</label>
                <input type="text" id="prenom" name="prenom" value="<?php echo $client['prenom']; ?>" readOnly="readOnly">
                <label for="pseudo">Pseudonyme :</label>
                <input type="text" id="pseudo" name="pseudo" value="<?php echo $client['username']; ?>" readOnly="readOnly" >
                <label for="mail">Adresse mail :</label>
                <input type="email" id="mail" name="mail" value="<?php echo $client['mail']; ?>" readOnly="readOnly" >
                <label for="naissance">Date de naissance :</label>
                <input type="naissance" id="naissance" name="naissance" value="<?php echo $client['naissance']; ?>"readOnly="readOnly" >
            </div>
        </form>

        <div class="slider-inner">
    <div id="cards-container"  style="margin: 20px 0;">
    <div>
</div>

</div>
        
        <script>
            
                document.addEventListener('DOMContentLoaded', function () {
                const photoInput = document.getElementById('photoInput');
                const photoPreview = document.getElementById('photoPreview');

                photoInput.addEventListener('change', function (event) {
                    previewPhoto(event);
                });

                function previewPhoto(event) {
                    const input = event.target;

                    if (input.files && input.files[0]) {
                        const reader = new FileReader();

                        reader.onload = function (e) {
                            photoPreview.src = e.target.result;
                        };

                        reader.readAsDataURL(input.files[0]);
                    }
                }
            });
        </script>
        <script type="module">
    import { displayItems } from './assets/js/movie-card.js';
    document.addEventListener('DOMContentLoaded', () => {
        const items = <?php echo json_encode($items); ?>;
        console.log(items);
        displayItems(items);
    });
</script>

</body>
</html>