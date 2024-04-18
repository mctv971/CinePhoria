<?php

require_once 'bd.php';
session_start();

// Vérification si la requête est une requête POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupération des données JSON envoyées dans la requête
    $data = json_decode(file_get_contents("php://input"));

    // Vérification si les données ont été correctement décodées
    if ($data) {
        // Récupération des données de la requête
        $userId = $_SESSION['client']['id_user'];
        $idType = $data->idType;
        $imdbId = $data->imdbId;

        try {
            // Connexion à la base de données
            $pdo = getBD();

            // Préparation de la requête d'insertion
            $stmt = $pdo->prepare("INSERT INTO favoris (id_user, id_type, imdb_id) VALUES (:userId, :idType, :imdbId)");
            $stmt->bindParam(':userId', $userId);
            $stmt->bindParam(':idType', $idType);
            $stmt->bindParam(':imdbId', $imdbId);

            // Exécution de la requête
            $stmt->execute();

            // Réponse JSON en cas de succès
            echo json_encode(array("message" => "Le favori a été ajouté avec succès."));
        } catch (PDOException $e) {
            // En cas d'erreur, retourner un message d'erreur JSON
            http_response_code(500);
            echo json_encode(array("message" => "Erreur lors de l'ajout du favori : " . $e->getMessage()));
        }

        // Fermeture de la connexion à la base de données
        $pdo = null;
    } else {
        // En cas d'erreur de décodage JSON
        http_response_code(400);
        echo json_encode(array("message" => "Erreur lors de la lecture des données JSON."));
    }
} else {
    // En cas de requête incorrecte
    http_response_code(405);
    echo json_encode(array("message" => "Méthode non autorisée."));
}

?>
