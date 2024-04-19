<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Poster de film généré</title>
</head>
<body>
    <button id="generatePosterButton">Générer Poster</button>
    <div id="imageContainer"></div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script>
        $(document).ready(function() {
            $('#generatePosterButton').click(function() {
                $.ajax({
                    type: "POST",
                    url: "ton_serveur.php",  // Assurez-vous que cette URL est correcte
                    data: {generatePoster: true},
                    dataType: "json",
                    success: function(response) {
                        if(response && response.url) {
                            $('#imageContainer').empty();  // Efface les images précédentes
                            $('#imageContainer').append('<img src="' + response.url + '" alt="Poster de film" style="width:100%;max-width:300px;">');
                        }
                    },
                    error: function() {
                        alert("Erreur lors de la génération des images.");
                    }
                });
            });
        });
    </script>
</body>
</html>
