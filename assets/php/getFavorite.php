<?php
session_start();

require_once('bd.php'); // Assurez-vous d'avoir le bon chemin vers le fichier bd.php

// Assurez-vous que la méthode de la requête est POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Assurez-vous que l'utilisateur est connecté
    if (!isset($_SESSION['client'])) {
        echo json_encode(['success' => false, 'message' => 'Utilisateur non connecté']);
        exit();
    }

    // Récupérez l'ID de l'utilisateur
    $id_user = $_SESSION['client']['id_user'];

    // Récupérez les données postées (ID du type)
    $data = json_decode(file_get_contents('php://input'), true);


    // Récupérez tous les favoris de l'utilisateur pour le type spécifié
    $favoris = getFavorites($id_user);

    if ($favoris !== false) {
        echo json_encode(['success' => true, 'favoris' => $favoris]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des favoris']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
}

// Fonction pour récupérer tous les favoris de l'utilisateur pour un type spécifié
function getFavorites($id_user) {
    try {
        $bd = getBD(); 

        $query = "SELECT * FROM Favoris WHERE id_user = :id_user";
        $stmt = $bd->prepare($query);

        $stmt->bindParam(':id_user', $id_user);

        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        return false;
    }
}
?>
