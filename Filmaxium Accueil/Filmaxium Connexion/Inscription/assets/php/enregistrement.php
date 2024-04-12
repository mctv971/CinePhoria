<?php
include 'bd.php';
try {
    $passwordHash = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $bdd = getBD();

        $requete = $bdd->prepare('INSERT INTO Users (username, nom, prenom,naissance,mail, mdp, pays) VALUES (?, ?, ?, ?, ?, ?, ?)');
        
        if($requete->execute(array($_POST['username'], $_POST['nom'], $_POST['prenom'], $_POST['naissance'], $_POST['mail'],$passwordHash,  $_POST['pays']))) {
            echo 'Succès';
        } else {
            print_r($requete->errorInfo());
        }
} catch (PDOException $e) {
    echo 'Erreur de connexion : ' . $e->getMessage();
}
?>
