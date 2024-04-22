<?php
session_start();

require_once('bd.php'); // Assurez-vous d'avoir le bon chemin vers le fichier bd.php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Assurez-vous que l'utilisateur est connecté
    if (!isset($_SESSION['client'])) {
        echo json_encode(['success' => false, 'message' => 'Utilisateur non connecté']);
        exit();
    }

    // Récupérez les données postées
    $data = json_decode(file_get_contents('php://input'), true);

    // Retirez le film/émission des favoris de l'utilisateur
    $success = removeFromFavorites($data);

    if ($success) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la suppression des favoris.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
}

function removeFromFavorites($data) {
    try {
        $bd = getBD();
        $id_user = $_SESSION['client']['id_user'];
        $imdb_id = $data['imdb_id'];

        $query = "DELETE FROM favoris WHERE id_user = :id_user AND imdb_id = :imdb_id";
        $stmt = $bd->prepare($query);

        $stmt->bindParam(':id_user', $id_user);
        $stmt->bindParam(':imdb_id', $imdb_id);

        return $stmt->execute();
    } catch (PDOException $e) {
        return false;
    }
}
?>
