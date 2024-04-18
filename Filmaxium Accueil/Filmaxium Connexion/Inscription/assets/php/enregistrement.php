<?php
include 'bd.php';

try {
    $passwordHash = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $bdd = getBD();

    $requete = $bdd->prepare('INSERT INTO Users (username, nom, prenom, naissance, mail, mdp, pays) VALUES (?, ?, ?, ?, ?, ?, ?)');

    if ($requete->execute(array($_POST['username'], $_POST['nom'], $_POST['prenom'], $_POST['naissance'], $_POST['mail'], $passwordHash, $_POST['pays']))) {
        $userId = $bdd->lastInsertId();

        $platforms = explode(',', $_POST['platforms']);
        // Log the platforms data to a text file
        file_put_contents('platform_log.txt', "Received platforms for user $userId: " . implode(', ', $platforms) . "\n", FILE_APPEND);

        foreach ($platforms as $platformId) {
            if (!empty($platformId)) {  // Check if the platform ID is not empty
                $plateformeRequete = $bdd->prepare('INSERT INTO Plateforme_Users (id_user, plateforme_id) VALUES (?, ?)');
                if (!$plateformeRequete->execute(array($userId, $platformId))) {
                    $errorInfo = implode(', ', $plateformeRequete->errorInfo());
                    file_put_contents('platform_log.txt', "Error inserting platform ID $platformId for user $userId: $errorInfo\n", FILE_APPEND);
                }
            } else {
                file_put_contents('platform_log.txt', "Skipped empty platform ID for user $userId\n", FILE_APPEND);
            }
        }
        echo 'Succès';
    } else {
        $errorInfo = implode(', ', $requete->errorInfo());
        file_put_contents('platform_log.txt', "Error inserting user: $errorInfo\n", FILE_APPEND);
    }
} catch (PDOException $e) {
    file_put_contents('platform_log.txt', 'Database error: ' . $e->getMessage() . "\n", FILE_APPEND);
    echo 'Database error: ' . $e->getMessage();
}
?>
