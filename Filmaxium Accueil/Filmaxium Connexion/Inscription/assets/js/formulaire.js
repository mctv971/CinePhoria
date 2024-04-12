const icons = document.querySelectorAll('.icones img');
            icons.forEach(icon => {
                icon.addEventListener('click', () => {
                    icon.classList.toggle('selected');
                });
            });
            document.addEventListener('DOMContentLoaded', function () {
                const photoInput = document.getElementById('photoInput');
                const photoPreview = document.getElementById('photoPreview');

                photoInput.addEventListener('change', function (event) {
                    previewPhoto(event);
                });

                function previewPhoto(event) {
                    const input = event.target;

                    if (input.files && input.files[0]) {
                        const reader = new FileReader();

                        reader.onload = function (e) {
                            photoPreview.src = e.target.result;
                        };

                        reader.readAsDataURL(input.files[0]);
                    }
                }
            });
            $(document).ready(function () {
    $('#inscriptionForm').submit(function (event) {
        event.preventDefault(); 
        var formData = $(this).serialize(); 

        $.ajax({
            type: 'POST',
            url: 'assets/php/enregistrement.php',
            data: formData,
            success: function (response) {
                $.ajax({
                    type: 'POST',
                    url: 'assets/php/login.php', // Chemin vers votre script de connexion
                    data: formData,
                    dataType: 'json', // S'attend à recevoir une réponse en JSON
                    success: function(response) {
                        if(response.connected) {
                            window.location.href = '../../../index.php';
                        } else {
                            alert(response.message); // Affiche le message d'erreur de connexion
                        }
                    },
                    error: function() {
                        alert('Erreur lors de la tentative de connexion.');
                    }
                });
            },
            error: function () {
                alert('Erreur lors de l\'inscription. Veuillez réessayer.');
            }
        });
    });
});
