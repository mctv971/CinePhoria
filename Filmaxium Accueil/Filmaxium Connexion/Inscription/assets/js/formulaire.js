document.addEventListener('DOMContentLoaded', function () {
    const icons = document.querySelectorAll('.icones img');
    console.log(icons.length + " icons found");  // This should match the number of your images

    icons.forEach(icon => {
        icon.addEventListener('click', () => {
            icon.classList.toggle('selected');
            console.log(icon.id + " toggled. Selected: " + icon.classList.contains('selected')); // This logs every click
        });
    });

    // Handle platform selection

    // Form submission handling
    $('#inscriptionForm').submit(function (event) {
        event.preventDefault();
        var formData = $(this).serialize();
        var platforms = [];
    
        $('.icones img.selected').each(function() {
            platforms.push($(this).data('platform-id'));
        });
    
        formData += '&platforms=' + platforms.join(',');
    
        // Première requête AJAX pour enregistrer l'utilisateur
        $.ajax({
            type: 'POST',
            url: 'assets/php/enregistrement.php',
            data: formData,
            success: function (response) {
                // Deuxième requête AJAX pour se connecter automatiquement après l'enregistrement
                loginUser();
            },
            error: function () {
                console.error('Registration failed. Please try again.');
            }
        });
    
        function loginUser() {
            $.ajax({
                type: 'POST',
                url: 'assets/php/login.php', // Assurez-vous que ce chemin est correct
                data: {username: $('#username').val(), password: $('#password').val()},
                success: function (response) {
                    var loginResponse = JSON.parse(response);
                    if (loginResponse.connected) {
                        window.location.href = '../../../index.php';
                    } else {
                        console.error("Login failed: " + loginResponse.message);
                    }
                },
                error: function () {
                    console.error('Login request failed. Please try again.');
                }
            });
        }
    });    
    
});
