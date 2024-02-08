<?php
session_start();
require("bd.php");

$csrf_token = isset($_POST['csrf_token']) ? $_POST['csrf_token'] : '';

if ($csrf_token !== $_SESSION['csrf_token'] ){
    echo json_encode(['success' => false, 'message' => 'ATTAQUE CSRF']);
    header('Location: erreur_csrf.php');
        exit;
}

$mailc = isset($_POST['mailc']) ? $_POST['mailc'] : '';
$mdp1c = isset($_POST['mdp1c']) ? $_POST['mdp1c'] : '';

$bdd = getBD();



$query = "SELECT * FROM Users WHERE mail = :mail";
$stmt = $bdd->prepare($query);
$stmt->bindParam(':mail', $mailc);
$stmt->execute();
$row = $stmt->fetch();

if ($row) {
    $mdp_hache = $row['mdp'];
    if (password_verify($mdp1c, $mdp_hache)) {
        $_SESSION['client'] = array(
            'id_user' => $row['id_user'],
            'nom' => $row['nom'],
            'prenom' => $row['prenom'],
            'naissance' => $row['naissance'],
            'pays' => $row['pays'],
            'mail' => $row['mail'],
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
