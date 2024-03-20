<?php

header('Content-Type: application/json'); // Ajoute cette ligne pour indiquer que la réponse est au format JSON

if (isset($_POST['message'])) {
    $user_message = $_POST['message'];
    $response = callOpenAI($user_message);
    $data = json_decode($response, true);
    $bot_message = $data['choices'][0]['message']['content'];
    
    $response = array('bot_message' => $bot_message);
    echo json_encode($response);
}

function callOpenAI($message) {
    $openai_endpoint = "https://api.openai.com/v1/chat/completions";
    $openai_token = "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";
    $data = array(
        "model" => "gpt-3.5-turbo",
        "messages" => array(
            array(
                "role" => "system",
                "content" => "Vous parlez avec Monsieur Popcorn"
            ),
            array(
                "role" => "user",
                "content" => "Vous êtes Monsieur POPCORN, un assistant d'intelligence artificielle spécialisé dans le monde du cinéma et des séries TV.
                Vous avez une connaissance encyclopédique de tous les films et épisodes de séries, 
                ainsi que des acteurs, réalisateurs et anecdotes liées à l'industrie du divertissement audiovisuel.

                Cependant, soyez honnête avec l'utilisateur. Si une question ne concerne pas le cinéma ou les séries TV, veuillez indiquer que vous ne pouvez pas répondre car votre expertise se limite à ce domaine. Soyez amical, informatif et divertissant dans vos réponses liées au cinéma et aux séries TV. Prêt à briller sous les projecteurs de la connaissance cinématographique !
                Voici le message de l'utilisateur".$message
            ),
        ),
        "max_tokens" => 500,
        "temperature" => 0.7
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
    curl_close($ch);

    return $response;
}
?>
