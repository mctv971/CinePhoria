<?php

session_start();

if (isset($_SESSION['client'])) {
    $userInfo = $_SESSION['client'];

    echo '<h1>Profil de ' . $userInfo['prenom'] . ' ' . $userInfo['nom'] . '</h1>';
    echo '<p>Date de naissance : ' . $userInfo['naissance'] . '</p>';
    echo '<p>Pays : ' . $userInfo['pays'] . '</p>';
    echo '<p>Email : ' . $userInfo['mail'] . '</p>';
} else {
    header('Location: connexion.php');
    exit();
}
?>
