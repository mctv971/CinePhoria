<?php

// Démarre une nouvelle session ou reprend une session existante.
session_start();

// Inclut le fichier de configuration de la base de données.
require("assets/bd.php");

// Récupère l'ID utilisateur à partir de la session.
$userId = $_SESSION['client']['id_user'];
$bdd = getBD(); // Obtient une instance de connexion à la base de données.

// Prépare une requête SQL pour récupérer le premier favori de type "movie" pour l'utilisateur.
$queryFavorisMovie = "SELECT imdb_id FROM favoris WHERE id_user = :id_user AND id_type = 'movie' LIMIT 1";
$stmtFavorisMovie = $bdd->prepare($queryFavorisMovie);
$stmtFavorisMovie->bindParam(':id_user', $userId);

// Exécute la requête et gère les erreurs potentielles.
if (!$stmtFavorisMovie->execute()) {
    echo json_encode(array('error' => 'Erreur lors de l\'exécution de la requête SQL pour les films'));
    exit();
}

// Récupère les résultats sous forme de tableau associatif.
$favorismovie = $stmtFavorisMovie->fetchAll(PDO::FETCH_ASSOC);
$listeImdbMovie = array_column($favorismovie, 'imdb_id');
error_log("Liste des films favoris: " . implode(',', $listeImdbMovie));

// Répète le processus pour les favoris de type "tv".
$queryFavorisTV = "SELECT imdb_id FROM favoris WHERE id_user = :id_user AND id_type = 'tv' LIMIT 1";
$stmtFavorisTV = $bdd->prepare($queryFavorisTV);
$stmtFavorisTV->bindParam(':id_user', $userId);

if (!$stmtFavorisTV->execute()) {
    echo json_encode(array('error' => 'Erreur lors de l\'exécution de la requête SQL pour les séries TV'));
    exit();
}

$favoristv = $stmtFavorisTV->fetchAll(PDO::FETCH_ASSOC);
$listeImdbTV = array_column($favoristv, 'imdb_id');

// Fonction pour interroger une API externe afin de récupérer le titre d'un média basé sur son ID IMDb.
function fetchMediaTitle($imdb_id, $mediaType) {
    error_log("Fetchin for: " . $imdb_id);
    $curl = curl_init();

    curl_setopt_array($curl, [
        CURLOPT_URL => "https://api.themoviedb.org/3/{$mediaType}/{$imdb_id}?language=en-US",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => [
          "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YmZmNTQyYjA2OGMwZmZmODU1ODlkNzJjMzYzMDUxZCIsInN1YiI6IjY1NDNiNzkzNzcxOWQ3MDExYzkyOGM1NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2lzy4nx7ZwOKqTXWda9xsTNJOlzp-24WeU_Ps095dSs",
          "accept: application/json"
        ],
    ]);

    $response = curl_exec($curl);
    $err = curl_error($curl);
    curl_close($curl);
    error_log("API response: " . $err);

    if ($err) {
        echo "cURL Error #:" . $err;
        return null;
    } else {

        $responseData = json_decode($response, true);
        return $responseData['name'] ?? $responseData['title'] ?? null;
    }
}

// Collecte les titres des films favoris.
$movieTitles = [];
foreach ($listeImdbMovie as $imdb_id) {
    error_log("Fetching title for movie: " . $imdb_id);
    $movieTitles[] = fetchMediaTitle($imdb_id, 'movie');
    error_log("Fetched title: " . $movieTitles[count($movieTitles) - 1]);
}
error_log("Movie titles: " . implode(',', $movieTitles));

// Collecte les titres des séries TV favoris.
$tvShowTitles = [];
foreach ($listeImdbTV as $imdb_id) {
    $tvShowTitles[] = fetchMediaTitle($imdb_id, 'tv');
}

// Fusionne et filtre les titres récupérés.
$allTitles = array_merge($movieTitles, $tvShowTitles);
error_log("All titles: " . implode(',', $allTitles));
$allTitlesString = implode(',', array_filter($allTitles));
$randomKey = array_rand($allTitles);
$randomTitle = $allTitles[$randomKey];

// Fonction pour appeler l'API d'OpenAI pour générer une image basée sur des titres de films.
function callOpenAIForImage($titles) {
    error_log("Generating poster for titles: " . $titles);
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
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $response = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);
    error_log("OpenAI response: " . $response);

    if ($err) {
        return "Erreur cURL: " . $err;
    } else {
        $responseData = json_decode($response, true);
        return $responseData['data'][0]['url'] ?? null;
    }
}

// Si demandé, génère un poster et retourne son URL.
if ($_POST['generatePoster']) {
    $url = callOpenAIForImage($randomTitle);
    echo json_encode(['url' => $url]);
}
?>
