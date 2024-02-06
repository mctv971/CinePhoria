<?php
session_start();

// Récupérer les valeurs depuis la requête POST
$id = $_POST['mediaId'];
$media = $_POST['mediaType'];

// Fonction pour obtenir l'IMDb ID
function getImdbId($mediaType, $mediaId) {
    $url = "https://api.themoviedb.org/3/{$mediaType}/{$mediaId}/external_ids?api_key=665e5d9951a7b784e6d00cf978e8b72c&language=en-US";
    $options = [
        'http' => [
            'method' => 'GET',
            'header' => 'Accept: application/json'
        ]
    ];

    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);

    if ($response === FALSE) {
        return null;
    }

    $result = json_decode($response, true);


    // Vérifier si la clé 'imdb_id' existe dans la réponse
    if (isset($result['imdb_id'])) {
        return $result['imdb_id'];
    } else {
        return null;
    }
}

// Obtenir l'IMDb ID
$imdbId = getImdbId($media, $id, $api_key);

// Stocker l'IMDb ID dans la session
$_SESSION['selectedMovieId'] = $imdbId;

echo 'Success';
?>
