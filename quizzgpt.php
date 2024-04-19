<?php
session_start();

if (isset($_GET['reset'])) {

    // Réinitialiser les variables spécifiques de session, si nécessaire
    $_SESSION['current_question'] = 0;
    $_SESSION['responses'] = [];

    // Rediriger vers la page de début du quizz
    header("Location: quizzgpt.php");
    exit;
}

// Vérifier si c'est un nouveau questionnaire ou une réinitialisation demandée
if (!isset($_SESSION['current_question']) || isset($_GET['reset'])) {
    $_SESSION['current_question'] = 0;
    $_SESSION['responses'] = [];
}


// Configuration de la fonction pour appeler OpenAI
function callOpenAI($messages) {
    $openai_endpoint = "https://api.openai.com/v1/chat/completions";
    $openai_token = '';  // Remplacez par votre clé secrète

    // Construction du prompt
    $prompt = "Basé sur les préférences suivantes:\n";
    foreach ($messages as $msg) {
        $prompt .= "- " . $msg['content'] . "\n";
    }
    $prompt .= "Liste des identifiants IMDb des films ou séries recommandés j'attends une liste d'idimdbséparé par des virgules aucun message de plus:";

    $data = array(
        "model" => "gpt-3.5-turbo",
        "messages" => array(array("role" => "system", "content" => $prompt)),
        "max_tokens" => 150,
        "temperature" => 0.5
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
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);

    // Vérification des erreurs cURL
    if ($response === false) {
        $error = curl_error($ch);
        curl_close($ch);
        error_log("Erreur cURL: " . $error);
        return false; // Retourne false en cas d'erreur
    }

    curl_close($ch);
    error_log("OpenAI response: " . $prompt);

    return $response;
}


$questions = [
    "Quels genres de films ou de séries apprécies-tu le plus ? (Action, comédie, drame, science-fiction, fantastique, documentaire, etc.)",
    "Ton humeur du moment : Cherches-tu quelque chose de léger et divertissant ou plutôt quelque chose de plus sérieux et profond en ce moment ?",
    "Durée préférée : Préfères-tu des épisodes courts et percutants ou des films/épisodes plus longs pour te plonger davantage dans l'histoire ?",
    "Style narratif : Es-tu plus attiré par des intrigues complexes et tordues ou préfères-tu des histoires simples et linéaires ?",
    "Préférences linguistiques : Préfères-tu regarder des films ou des séries dans leur langue d'origine avec des sous-titres, ou tu privilégies la version doublée ?"
];

$options = [
    ["Action", "Comédie", "Drame", "Science-fiction", "Fantastique", "Documentaire"],
    ["Léger et divertissant", "Sérieux et profond"],
    ["Courts et percutants", "Longs et immersifs"],
    ["Intrigues complexes et tordues", "Histoires simples et linéaires"],
    ["Langue d'origine avec sous-titres", "Version doublée"]
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $response = $_POST['response'];
    $_SESSION['responses'][] = $response;
    $current_question = $_SESSION['current_question'];

    if ($current_question < count($questions) - 1) {
        $_SESSION['current_question']++;
    } else {
        $user_responses = [];
        foreach ($_SESSION['responses'] as $resp) {
            $user_responses[] = ["role" => "user", "content" => $resp];
        }
        $response = callOpenAI($user_responses);
        $data = json_decode($response, true);
        error_log("OpenAI response: " . print_r($data, true));

        if (isset($data['choices'][0]['message']['content'])) {
            $imdb_ids_raw = $data['choices'][0]['message']['content'];
            $imdb_ids = preg_replace("/[^a-zA-Z0-9,]/", "", $imdb_ids_raw);
            $_SESSION['imdb_ids'] = $imdb_ids;
            header("Location: display_movies.php"); // Rediriger vers la page d'affichage
            exit;
        } else {
            echo "<p>Erreur dans la réponse de l'API OpenAI.</p>";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="assets/css/quizz.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap" rel="stylesheet">
    <title>Recommendation Bot</title>
    
</head>
<body>
<div class="logo-container">
        <img src="Filmaxium Accueil/Filmaxium Connexion/images/logo.png" alt="Logo">
    </div>
<div class="container">
    <div class="question"><?php echo $questions[$_SESSION['current_question']]; ?></div>
    <div class="form-container">
        <form method="POST">
            <select name="response" class="styled-select"required>
                <?php foreach ($options[$_SESSION['current_question']] as $option): ?>
                    <option value="<?php echo $option; ?>"><?php echo $option; ?></option>
                <?php endforeach; ?>
            </select><br>
            <input type="image" src="assets/images/bouton.png">
        </form>
    </div>
</div>
</body>
</html>