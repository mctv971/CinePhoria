<?php

require_once 'bd.php';
session_start();

// Vérification si la requête est une requête POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Connexion à la base de données
        $pdo = getBD();

        // Récupération de l'ID de l'utilisateur depuis la session (supposons qu'il soit stocké dans $_SESSION['client']['id_user'])
        $userId = $_SESSION['client']['id_user'];

        // Préparation de la requête de mise à jour de la colonne demo
        $stmt = $pdo->prepare("UPDATE users SET demo = 1 WHERE id_user = :userId");
        $stmt->bindParam(':userId', $userId);

        // Exécution de la requête
        $stmt->execute();

        // Réponse JSON en cas de succès
        echo json_encode(array("message" => "La colonne demo a été mise à jour avec succès."));
    } catch (PDOException $e) {
        // En cas d'erreur, retourner un message d'erreur JSON
        http_response_code(500);
        echo json_encode(array("message" => "Erreur lors de la mise à jour de la colonne demo : " . $e->getMessage()));
    }

    // Fermeture de la connexion à la base de données
    $pdo = null;
} else {
    // En cas de requête incorrecte
    http_response_code(405);
    echo json_encode(array("message" => "Méthode non autorisée."));
}

?>
