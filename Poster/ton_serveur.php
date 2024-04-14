<?php

session_start();
require("assets/bd.php");

$userId = $_SESSION['client']['id_user'];
$bdd = getBD();

// Récupération des favoris de type "movie"
$queryFavorisMovie = "SELECT imdb_id FROM Favoris WHERE id_user = :id_user AND id_type = 'movie' LIMIT 1";
$stmtFavorisMovie = $bdd->prepare($queryFavorisMovie);
$stmtFavorisMovie->bindParam(':id_user', $userId);

if (!$stmtFavorisMovie->execute()) {
    echo json_encode(array('error' => 'Erreur lors de l\'exécution de la requête SQL pour les films'));
    exit();
}

$favorismovie = $stmtFavorisMovie->fetchAll(PDO::FETCH_ASSOC);
$listeImdbMovie = array_column($favorismovie, 'imdb_id');

// Récupération des favoris de type "tv"
$queryFavorisTV = "SELECT imdb_id FROM Favoris WHERE id_user = :id_user AND id_type = 'tv' LIMIT 1";
$stmtFavorisTV = $bdd->prepare($queryFavorisTV);
$stmtFavorisTV->bindParam(':id_user', $userId);

if (!$stmtFavorisTV->execute()) {
    echo json_encode(array('error' => 'Erreur lors de l\'exécution de la requête SQL pour les séries TV'));
    exit();
}

$favoristv = $stmtFavorisTV->fetchAll(PDO::FETCH_ASSOC);
$listeImdbTV = array_column($favoristv, 'imdb_id');

// Fonction pour récupérer le titre d'un média (film ou série TV) en utilisant l'API
function fetchMediaTitle($imdb_id, $mediaType) {
    $curl = curl_init();

    curl_setopt_array($curl, [
        CURLOPT_URL => "https://api.themoviedb.org/3/{$mediaType}/{$imdb_id}?language=en-US",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjVlNWQ5OTUxYTdiNzg0ZTZkMDBjZjk3OGU4YjcyYyIsInN1YiI6IjY1Mzc3YzIxYzUwYWQyMDEyZGY0YjI2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jMOywP2uIuyrtnbX0kYWNkbGf0wTMUnNmKsFrNhcVXU",
            "accept: application/json"
        ],
    ]);

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
        echo "cURL Error #:" . $err;
        return null;
    } else {
        $responseData = json_decode($response, true);
        return $responseData['name'] ?? $responseData['title'] ?? null;
    }
}

// Récupération des titres des films
$movieTitles = [];
foreach ($listeImdbMovie as $imdb_id) {
    $movieTitles[] = fetchMediaTitle($imdb_id, 'movie');
}

// Récupération des titres des séries TV
$tvShowTitles = [];
foreach ($listeImdbTV as $imdb_id) {
    $tvShowTitles[] = fetchMediaTitle($imdb_id, 'tv');
}

// Fusionner les deux listes de titres
$allTitles = array_merge($movieTitles, $tvShowTitles);

// Création d'une seule chaîne de caractères contenant tous les titres
$allTitlesString = implode(',', array_filter($allTitles));
$randomKey = array_rand($allTitlesString);
$randomTitle = $allTitles[$randomKey];
function callOpenAIForImage($titles) {
    $openai_endpoint = "https://api.openai.com/v1/images/generations";
    $openai_token = "";
    $prompt = "Create a visually appealing and realistic movie poster based on the following titles: " . $titles;

    $data = array(
        "model" => "dall-e-2",
        "prompt" => $prompt,
        "n" => 1,
        "size" => "1024x1024"
    );

    $headers = array(
        "Content-Type: application/json",
        "Authorization: Bearer " . $openai_token
    );

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $openai_endpoint);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $response = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if ($err) {
        return "Erreur cURL: " . $err;
    } else {
        $responseData = json_decode($response, true);
        return $responseData['data'][0]['url'] ?? null;
    }
}

if ($_POST['generatePoster']) {
    $url = callOpenAIForImage($randomTitle);
    echo json_encode(['url' => $url]);
}
?>
