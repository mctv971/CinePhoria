<?php
session_start();
require("bd.php");
$csrf_token = isset($_POST['csrf_token']) ? $_POST['csrf_token'] : '';

if ($csrf_token !== $_SESSION['csrf_token'] ){
    echo json_encode(['success' => false, 'message' => 'ATTAQUE CSRF']);
    header('Location: erreur_csrf.php');
    exit;
}

function enregistrer($nom, $prenom, $adresse, $numero, $mail, $mdp1) {
    try {
        $bdd = getBD();
        $mdp_hash = password_hash($mdp1, PASSWORD_DEFAULT);
        $query = "INSERT INTO Users (nom, prenom, naissance, mail, pays, mdp) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $bdd->prepare($query);
        $stmt->execute([$nom, $prenom, $adresse, $mail,$numero, $mdp_hash]);

        $bdd = null;

        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
        exit;
    } catch (PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Erreur dans l\'enregistrement : ' . $e->getMessage()]);
        exit;
    } catch (\Stripe\Exception\ApiErrorException $e) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Erreur dans la création du compte Stripe : ' . $e->getMessage()]);
        exit;
    }
}

$nom = isset($_POST['n']) ? $_POST['n'] : '';
$prenom = isset($_POST['p']) ? $_POST['p'] : '';
$adresse = isset($_POST['adr']) ? $_POST['adr'] : '';
$numero = isset($_POST['num']) ? $_POST['num'] : '';
$mail = isset($_POST['mail']) ? $_POST['mail'] : '';
$mdp1 = isset($_POST['mdp1']) ? $_POST['mdp1'] : '';
$mdp2 = isset($_POST['mdp2']) ? $_POST['mdp2'] : '';



if (empty($nom) || empty($prenom) || empty($adresse) || empty($numero) || empty($mail) || empty($mdp1) || empty($mdp2) || $mdp1 !== $mdp2) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Erreur de validation']);
    exit;
} else {
    enregistrer($nom, $prenom, $adresse, $numero, $mail, $mdp1);
    header('Content-Type: application/json');
    echo json_encode(['success' => true]);
}
?>
