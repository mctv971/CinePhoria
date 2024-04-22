<?php
session_start();

require_once('bd.php'); // Assurez-vous d'avoir le bon chemin vers le fichier bd.php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Assurez-vous que l'utilisateur est connecté
    if (!isset($_SESSION['client'])) {
        echo json_encode(['isFavorite' => false, 'error' => 'Utilisateur non connecté']);
        exit();
    }

    // Récupérez les données postées
    $data = json_decode(file_get_contents('php://input'), true);
    // Vérifiez si le film/émission est dans les favoris de l'utilisateur
    $isFavorite = checkIfFavorite($data);

    echo json_encode(['isFavorite' => $isFavorite]);
} else {
    echo json_encode(['isFavorite' => false, 'error' => 'Méthode non autorisée']);
}

function checkIfFavorite($data) {
    try {
        $bd = getBD();
        $id_user = $_SESSION['client']['id_user'];
        $imdb_id = $data['imdb_id'];

        $query = "SELECT COUNT(*) FROM favoris WHERE id_user = :id_user AND imdb_id = :imdb_id";
        $stmt = $bd->prepare($query);

        $stmt->bindParam(':id_user', $id_user);
        $stmt->bindParam(':imdb_id', $imdb_id);

        $stmt->execute();

        $count = $stmt->fetchColumn();
        


        return $count > 0;
    } catch (PDOException $e) {
        // Ajout de logs pour débogage
        error_log('CheckIfFavorite Error: ' . $e->getMessage());
        return false;
    }
}
?>
