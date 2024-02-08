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

    // Vérifiez si l'ID du type est envoyé
    if (!isset($data['id_type'])) {
        echo json_encode(['success' => false, 'message' => 'ID du type manquant']);
        exit();
    }

    // Récupérez l'ID de l'utilisateur
    $id_user = $_SESSION['client']['id_user'];
    // Récupérez l'ID du type envoyé
    $id_type = $data['id_type'];

    // Récupérez tous les favoris de l'utilisateur pour le type spécifié
    $favoris = getFavoritesByType($id_user, $id_type);

    if ($favoris !== false) {
        echo json_encode(['success' => true, 'favoris' => $favoris]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des favoris']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
}

// Fonction pour récupérer tous les favoris de l'utilisateur pour un type spécifié
function getFavoritesByType($id_user, $id_type) {
    try {
        $bd = getBD();

        $query = "SELECT * FROM Favoris WHERE id_user = :id_user AND id_type = :id_type";
        $stmt = $bd->prepare($query);

        $stmt->bindParam(':id_user', $id_user);
        $stmt->bindParam(':id_type', $id_type);

        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        return false;
    }
}
?>
