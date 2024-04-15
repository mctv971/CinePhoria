
// Requête AJAX JQUERY permettant la connexion de l'utilisateur avec le pseudonyme et le mot de passe.
$(document).ready(function() {
    $('#loginForm').submit(function(event) {
        event.preventDefault();

        var username = $('#username').val();
        var password = $('#password').val();
        $.ajax({
            type: 'POST',
            url: 'assets/php/login.php',
            data: {username: username, password: password},
            dataType: 'json',
            success: function(response) {
                console.log(response); // Afficher la réponse dans la console du navigateur
                if (response.connected) {
                    window.location.href = 'index.php';
                } else {
                    alert(response.message); // Afficher le message d'erreur
                }
            }
        });
    });
});
