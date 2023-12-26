<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Filmaxium</title>
    <link rel="stylesheet" href="style.css" type="text/css" media="screen" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
</head>
<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();
if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
?>

<body class='ici'>
    <div class="formulaire">
        <form id="inscriptionForm" method="post" autocomplete="on">
            
            <input type="hidden" name="csrf_token" value="<?= $_SESSION['csrf_token'] ?>">
            <label for="n"> Nom : </label>
            <input type="text" id="n" name="n" value="<?= isset($_GET['n']) ? $_GET['n'] : ''; ?>"><br>

            <label for="p"> Prenom : </label>
            <input type="text" id="p" name="p" value="<?= isset($_GET['p']) ? $_GET['p'] : ''; ?>"><br>

            <label for="adr"> Date de Naissance : </label>
            <input type="date" id="adr" name="adr" value="<?= isset($_GET['adr']) ? $_GET['adr'] : ''; ?>"><br>

            <label for="num">Pays:</label>

                <select name="num" id="num">
                    <option value="France">France</option>
                    <option value="Angleterre">Angleterre</option>
                    <option value="Etat Unis">Etat Unis</option>
                    <option value="Japon">Japon</option>
                    <option value="Allemagne">Allemagne</option>
                </select>

            </br><label for="mail"> Email : </label>
            <input type="text" id="mail" name="mail" value="<?= isset($_GET['mail']) ? $_GET['mail'] : ''; ?>" class="email-input"><br>
            
            <label for="mdp1"> Mot de passe : </label>
            <input type="password" id="mdp1" name="mdp1"><br>

            <label for="mdp2"> Confirmez votre mot de passe : </label>
            <input type="password" id="mdp2" name="mdp2"><br>
            <div id="error-message" class="error-message"></div>
            <input type="submit" value="S'inscrire" id="submitBtn"><br>
        </form>
        <div id="message"></div>
    </div>
    <script>
        $(document).ready(function () {
    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPassword(password) {
        var passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    function toggleSubmitButton() {
        var valid = true;
        $('input[type="text"], input[type="password"]').each(function () {
            if (!$(this).hasClass('valid')) {
                valid = false;
                return false;
            }
        });

        return valid;
    }

    function updateFieldStatus(input, isValid, errorMessage) {
        var parentDiv = input.parent();
        var errorDiv = parentDiv.find('.error-message');

        if (isValid) {
            input.removeClass('invalid').addClass('valid');
            errorDiv.text('');
        } else {
            input.removeClass('valid').addClass('invalid');
            errorDiv.text(errorMessage);
        }
    }

    function updateErrorMessage(message) {
        $('#error-message').text(message);
    }

    $('#inscriptionForm').submit(function (e) {
        e.preventDefault();

        if (toggleSubmitButton()) {
            var email = $('#mail').val();

            if (!isValidEmail(email)) {
                updateFieldStatus($('#mail'), false, 'Veuillez entrer une adresse e-mail valide.');
                return false;
            }

            $.ajax({
                url: 'verification_email.php',
                type: 'POST',
                data: { email: $('#mail').val() },
                dataType: 'json',
                success: function (response) {
                    if (!response.exists) {
                        $.ajax({
                            url: 'enregistrement.php',
                            type: 'POST',
                            data: $('#inscriptionForm').serialize(),
                            dataType: 'json',
                            success: function (response) {
                                if (response.success) {
                                    var loginData = {
                                        mailc: $('#mail').val(),
                                        mdp1c: $('#mdp1').val(),
                                        csrf_token: $('[name="csrf_token"]').val(),
                                    };
                                    $.ajax({
                                        url: 'connecter.php',
                                        type: 'POST',
                                        data: loginData,
                                        dataType: 'json',
                                        success: function (response) {
                                            if (response.connected) {
                                                $('#message').html('<div class="valid">Compte créé et connecté avec succès. Redirection en cours...</div>');
                                                setTimeout(function () {
                                                    window.location.href = 'index.php';
                                                }, 1000);
                                            } else {
                                                $('#message').html('<div class="invalid">Erreur lors de la connexion automatique après la création du compte : ' + response.message + '</div>');
                                            }
                                        },
                                        error: function () {
                                            console.error('Erreur lors de la connexion automatique après la création du compte.');
                                        }
                                    });
                                } else {
                                    updateErrorMessage('Erreur lors de la création du compte : ' + response.message);
                                }
                            },
                            error: function () {
                                console.error('Erreur lors de la création du compte.');
                            }
                        });
                    } else {
                        updateFieldStatus($('#mail'), false, 'Cette adresse e-mail existe déjà.');
                        updateErrorMessage('Cette adresse e-mail existe déjà.');
                    }
                },
                error: function () {
                    console.error('Erreur lors de la vérification de l\'e-mail.');
                }
            });
        }
    });

    $('input[type="text"], input[type="password"]').focusout(function () {
        var value = $(this).val();
        var id = $(this).attr('id');

        switch (id) {
            case 'n':
            case 'p':
            case 'adr':
                updateFieldStatus($(this), value.trim() !== '', 'Ce champ ne peut pas être vide.');
                break;

            case 'num':
                updateFieldStatus($(this), /^\d+$/.test(value), 'Veuillez entrer un numéro de téléphone valide.');
                break;

            case 'mail':
                updateFieldStatus($(this), isValidEmail(value), 'Veuillez entrer une adresse e-mail valide.');
                break;

            case 'mdp1':
                updateFieldStatus($(this), isValidPassword(value), 'Le mot de passe doit contenir au moins 1 lettre, 1 chiffre et 1 caractère spécial, et avoir une longueur minimale de 8 caractères.');
                break;

            case 'mdp2':
                var password1 = $('#mdp1').val();
                updateFieldStatus($(this), value === password1, 'Les mots de passe ne correspondent pas.');
                break;
        }
    });

    $('input[type="text"], input[type="password"]').on('input', function () {
        $(this).removeClass('valid invalid');
        $(this).parent().find('.error-message').text('');
    });
});

    </script>
</body>
</html>
