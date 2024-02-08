<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();

require_once('bd.php'); // Assurez-vous d'avoir le bon chemin vers le fichier bd.php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Assurez-vous que l'utilisateur est connecté
    if (!isset($_SESSION['client'])) {
        echo json_encode(['success' => false, 'message' => 'L\'utilisateur n\'est pas connecté.']);
        exit();
    }

    // Récupérez les données postées
    $data = json_decode(file_get_contents('php://input'), true);

    // Ajoutez le film/émission aux favoris de l'utilisateur
    if (addToFavorites($data)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'ajout aux favoris.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
}

function addToFavorites($data) {
    try {
        $bd = getBD();
        $id_user = $_SESSION['client']['id_user'];
        $id_type = $data['id_type'];
        $imdb_id = $data['imdb_id'];


        $query = "INSERT INTO Favoris (id_user, id_type, imdb_id) VALUES (:id_user, :id_type, :imdb_id)";
        $stmt = $bd->prepare($query);

        $stmt->bindParam(':id_user', $id_user);
        $stmt->bindParam(':id_type', $id_type);
        $stmt->bindParam(':imdb_id', $imdb_id);

        return $stmt->execute();
    } catch (PDOException $e) {
        return false;
    }
}
?>
