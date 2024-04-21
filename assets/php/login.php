<?php

// Fichier permettant la connexion à un compte d'utilisateurs
session_start();
require("bd.php");

$username = isset($_POST['username']) ? $_POST['username'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

$bdd = getBD();

//Requête permettant de vérifier si le username correspond à un username dans la base de données avec verification du mot de passe
$query = "SELECT * FROM Users WHERE username = :username";
$stmt = $bdd->prepare($query);
$stmt->bindParam(':username', $username);
$stmt->execute();
$row = $stmt->fetch();

if ($row) {
    //Verification du mot de passe avant d'initialiser les variables de la session utilisateurs
    $mdp_hache = $row['mdp'];
    if (password_verify($password, $mdp_hache)) {
        $_SESSION['client'] = array(
            'id_user' => $row['id_user'],
            'username' => $row['username'],
            'nom' => $row['nom'],
            'prenom' => $row['prenom'],
            'naissance' => $row['naissance'],
            'mail' => $row['mail'],
            'pays' => $row['pays'],
            'demo' => $row['demo'],
        );
        echo json_encode(['connected' => true]);
        exit();

    } else {
        echo json_encode(array('connected' => false, 'message' => 'Mot de passe incorrect'));
        exit();
    }
} else {
    echo json_encode(array('connected' => false, 'message' => 'Utilisateur non trouvé'));
    exit();
}
?>
