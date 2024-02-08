<?php
if (isset($_POST['email'])) {
    $email = $_POST['email'];
    require("bd.php");

    try {
        $bdd = getBD();
        $query = "SELECT * FROM Users WHERE mail = :mail";
        $stmt = $bdd->prepare($query);
        $stmt->bindParam(':mail', $email);
        $stmt->execute();
        $exists = ($stmt->rowCount() > 0);

        $response = array('exists' => $exists);

        header('Content-Type: application/json');
        echo json_encode($response);
    } catch (PDOException $e) {
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(['error' => 'Erreur lors de la vérification de l\'e-mail: ' . $e->getMessage()]);
    } finally {
        $bdd = null;
    }
} else {
    header('HTTP/1.1 400 Bad Request');
    echo 'Paramètre email manquant.';
}
?>
