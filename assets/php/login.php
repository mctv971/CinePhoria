<?php
session_start();
require("bd.php");

$username = isset($_POST['username']) ? $_POST['username'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';



$bdd = getBD();

$query = "SELECT * FROM users WHERE username = :username";
$stmt = $bdd->prepare($query);
$stmt->bindParam(':username', $username);
$stmt->execute();
$row = $stmt->fetch();

if ($row) {
    $mdp_hache = $row['mdp'];
    if (password_verify($password, $mdp_hache)) {
        $_SESSION['client'] = array(
            'id_user' => $row['id_user'],
            'nom' => $row['nom'],
            'prenom' => $row['prenom'],
            'naissance' => $row['naissance'],
            'mail' => $row['mail'],
            'pays' => $row['pays'],
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
