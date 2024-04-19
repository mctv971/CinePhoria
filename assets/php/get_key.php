<?php
require_once 'bd.php';

/**
 * Récupère la clé API pour un service spécifié depuis une base de données.
 * Cette fonction établit une connexion à la base de données via la fonction `getBD()`,
 * prépare et exécute une requête SQL pour obtenir la clé API associée à un service donné.
 * Elle utilise des requêtes préparées pour prévenir les injections SQL.
 * La fonction retourne la clé API sous forme de chaîne de caractères si elle est trouvée, ou null si aucune clé n'est associée au service.
 *
 * @param string $service Le nom du service pour lequel la clé API est requise.
 * @return string|null La clé API pour le service spécifié, ou null si aucune clé n'est trouvée.
 */
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
