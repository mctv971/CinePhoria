<?php
require_once 'bd.php';

// Fonction pour récupérer la clé API pour un service spécifique
function getAPIKey($service) {
    $bdd = getBD();
    $query = $bdd->prepare("SELECT api_key FROM api_keys WHERE service = :service");
    $query->execute(array(':service' => $service));
    $result = $query->fetch(PDO::FETCH_ASSOC);
    return $result['api_key'];
}

// Récupération des clés API
$chatgpt_key = getAPIKey('CHATGPT');
$tmdb_key = getAPIKey('TMDB');
$imdb_key = getAPIKey('IMDB');

// Retourner les clés API sous forme JSON
echo json_encode(array(
    'chatgpt_key' => $chatgpt_key,
    'tmdb_key' => $tmdb_key,
    'imdb_key' => $imdb_key,
));
?>
