$(document).ready(function() {

    var id_type = localStorage.getItem('itemType');
    var imdb_id = localStorage.getItem('itemId');
    var id_commentaire_parent = null;

    // Définir les valeurs des éléments cachés "id_type" et "imdb_id"
    $('#id_type').val(id_type);
    $('#imdb_id').val(imdb_id);
    
    // Fonction pour ajouter un commentaire
    function ajouterCommentaire(id_type, imdb_id, contenu, id_commentaire_parent = null) {
        $.ajax({
            url: 'assets/php/commentaires.php',
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'ajouter_commentaire',
                id_type: id_type,
                imdb_id: imdb_id,
                contenu: contenu,
                id_commentaire_parent: id_commentaire_parent
            },
            success: function(response) {
                if (response.success) {
                    // Commentaire ajouté avec succès
                    console.log(response.message);
                    // Actualiser les commentaires après l'ajout
                    recupererCommentaires(id_type, imdb_id);
                } else {
                    // Erreur lors de l'ajout du commentaire
                    console.error(response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('Erreur lors de l\'envoi de la requête AJAX :', error);
            }
        });
    }


    // Fonction pour récupérer les commentaires
    function recupererCommentaires(id_type, imdb_id) {
        $.ajax({
            url: 'assets/php/commentaires.php',
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'recuperer_commentaires',
                id_type: id_type,
                imdb_id: imdb_id
            },
            success: function(response) {
                if (response.success) {
                    // Afficher les commentaires récupérés
                    $('.commentaire').remove();
                    afficherCommentaires(response.commentaires, 0);
                } else {
                    // Erreur lors de la récupération des commentaires
                    console.error(response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('Erreur lors de l\'envoi de la requête AJAX :', error);
            }
        });
    }


    // Fonction pour afficher les commentaires sur la page
// Fonction pour afficher les commentaires avec leurs réponses
function afficherCommentaires(commentaires, id_parent) {
    commentaires.forEach(function(commentaire) {
        // Vérifier si le commentaire actuel est lié au commentaire parent donné
        if (commentaire.id_commentaire_parent == id_parent) {
            
            var commentaireHTML = '<div class="commentaire';
            
            // Ajouter la classe commentaire-enfant si c'est un commentaire enfant
            if (id_parent !== 0) {
                commentaireHTML += ' commentaire-enfant' + '" data-id-parent="' + id_parent ;
            }
            
            commentaireHTML += '" data-id="' + commentaire.id_commentaire + '">' +
            '<div class="profil-container">' +
            '<img src="assets/images/logo-profil.png" class="profil">' +
            '<p class="username">' + commentaire.username + '</p>' +
            '</div>' +
            '<div class="contenu">' +
            '<span class="date">' + commentaire.date + '</span>' +
            '<p class="content">' + commentaire.contenu + '</p>';
        
            // Vérifie si nb_reponses est supérieur à 0 avant d'ajouter le span
            if (commentaire.nb_reponses > 0) {
                commentaireHTML += '<div class="reponse-container">'
                +'<span class="nb-reponses">' + commentaire.nb_reponses + ' Réponses</span>'
                + '<img src="assets/images/down.png" class="reponse">' +
                '</div>';
            }
            
            commentaireHTML += '</div>' +
                '<div class="repondre-container">' +
                '<img src="assets/images/repondre.png" class="repondre" data-id= '+ commentaire.id_commentaire + '>' +
                '</div>' +
                '</div>';

            // Ajouter le commentaire à la liste
            var $commentaire = $(commentaireHTML);
            $('#commentaires-liste').append($commentaire);

            // Vérifier s'il y a des réponses associées à ce commentaire
            if (commentaire.nb_reponses > 0) {
              
                // Cacher les commentaires enfants au début
                // Ajouter un gestionnaire d'événements pour afficher les commentaires enfants lorsqu'on clique sur le nombre de réponses
                $commentaire.find('.reponse-container').click(function() {
                    var id_parent = $(this).closest('.commentaire').data('id');
                    var $reponseIcon = $(this).find('.reponse');
                    $('.commentaire[data-id-parent="' + id_parent + '"]').toggleClass('active');


                    if ($reponseIcon.attr('src') === 'assets/images/down.png') {
                        $reponseIcon.attr('src', 'assets/images/up.png');
                    } else {
                        $reponseIcon.attr('src', 'assets/images/down.png');
                    }
                });


                // Récupérer et afficher les réponses (commentaires enfants)
                afficherCommentaires(commentaires, commentaire.id_commentaire);
            }
        }
    });
}

    


    // Écouteur d'événements pour le soumission du formulaire de commentaire
    $('#commentaire-formulaire').submit(function(event) {
        // Empêcher le comportement par défaut du formulaire
        event.preventDefault();

        // Récupérer les valeurs du formulaire
        var id_type = localStorage.getItem('itemType');
        var imdb_id = localStorage.getItem('itemId');
        var contenu = $('#contenu').val();
        var id_commentaire_parent = $('#id_commentaire_parent').val();

        // Si id_commentaire_parent est différent de "", utiliser cette valeur
        if (id_commentaire_parent !== "") {
            ajouterCommentaire(id_type, imdb_id, contenu, id_commentaire_parent);
            $('#id_commentaire_parent').val("");
        } else {
            // Sinon, ajouter le commentaire sans id_commentaire_parent
            ajouterCommentaire(id_type, imdb_id, contenu);
        }
        $('#contenu').val("");
        
    });

    // Au chargement initial de la page, récupérer et afficher les commentaires
    var id_type_initial = localStorage.getItem('itemType');
    var imdb_id_initial = localStorage.getItem('itemId');
    recupererCommentaires(id_type_initial, imdb_id_initial);     
    $(document).on('click', '.repondre', function() {
        if($(this).closest('.commentaire').find('.reponse-message')){
            $('.reponse-message').remove();
        }
        else{
            alert("zuit")
        }
        
        var id_commentaire_parent = $(this).data('id');
        var username_commentaire_parent = $(this).closest('.commentaire').find('.profil-container .username').text();
        var contenu_commentaire_parent = $(this).closest('.commentaire').find('.contenu .content').text();
        
        var message_reponse = '<div class="affiche-repondre">' +
        '<span class="reponse-intro">Vous répondez à </span><span class="username">' + username_commentaire_parent + ' :</span>' +
        '<div class="closeRep"><img src="assets/images/close.png" alt="Fermer" style="position: absolute;width: 48px;right: 0;" /></div>' +
        '</div><br>' + contenu_commentaire_parent;

        var $reponseMessage = $('<div class="reponse-message">' + message_reponse + '</div>');
    
        $('#commentaire-formulaire').before($reponseMessage);
        $('#id_commentaire_parent').val(id_commentaire_parent);

            // Gestion de l'événement clic sur le bouton de fermeture
        $('.closeRep img').on('click', function() {
            $('.reponse-message').remove();  // Supprime le message de réponse
            $('#id_commentaire_parent').val("");  // Efface l'ID du commentaire parent
        });

    });
    $(document).on('click', '.retour-fiche', function(){
        $('.commentaires').removeClass('active');
        $('#chatIconDetail').css('display', 'block');

    })
    $(document).on('click', '#chatIconDetail', function(){
        $('.commentaires').addClass('active');
        $('#chatIconDetail').css('display', 'none');

    })
    
    
    
});
