<?php
// Inclusion du fichier de connexion à la base de données
require_once('./assets/php/bd.php');

// Démarrage de la session
session_start();

// Connexion à la base de données
$bdd = getBD();

// Vérification si l'utilisateur est déjà connecté
if (isset($_SESSION['client'])) {
    // Redirection vers une page d'accueil par exemple
    header("Location: index.php");
    exit;
}

// Vérification si le formulaire de connexion est soumis
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupération des données du formulaire
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Requête SQL pour vérifier les informations de connexion
    $query = $bdd->prepare("SELECT * FROM users WHERE username = :username AND mdp = :password");
    $query->bindParam(':username', $username);
    $query->bindParam(':password', $password);
    $query->execute();
    
    // Vérification si l'utilisateur existe dans la base de données
    if ($row = $query->fetch()) {
        // Stockage des informations de l'utilisateur dans la session
        $_SESSION['client'] = array(
            'id_user' => $row['id_user'],
            'username' => $row['username'],
            'nom' => $row['nom'],
            'prenom' => $row['prenom'],
            'naissance' => $row['naissance'],
            'mail' => $row['mail'],
            'pays' => $row['pays']
        );

        // Redirection vers une page d'accueil par exemple
        header("Location: index.php");
        exit;
    } else {
        // En cas d'informations de connexion incorrectes, affichage d'un message d'erreur
        $error_message = "Adresse email ou mot de passe incorrect.";
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion</title>
</head>
<body>
    <h2>Connexion</h2>
    <?php if (isset($error_message)) { ?>
        <p><?php echo $error_message; ?></p>
    <?php } ?>
    <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
        <label for="username">Username:</label><br>
        <input type="text" id="username" name="username" value="test"><br>
        <label for="password">Mot de passe:</label><br>
        <input type="password" id="password" name="password" value="test"><br><br>
        <input type="submit" value="Se connecter">
    </form>
</body>
</html>
