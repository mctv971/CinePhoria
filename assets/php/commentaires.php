<?php
    // Inclure le fichier de configuration de la base de données
    session_start();
    require_once('bd.php');
    $bd = getBD();

    // Vérifier si la requête est une requête AJAX
    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
        // Vérifier le type d'action à effectuer
        if (isset($_POST['action'])) {
            $action = $_POST['action'];

            switch ($action) {
                case 'ajouter_commentaire':
                    ajouterCommentaire();
                    break;
                case 'recuperer_commentaires':
                    recupererCommentaires();
                    break;
                default:
                    // Action non reconnue
                    echo json_encode(['success' => false, 'message' => 'Action non reconnue']);
                    break;
            }
        } else {
            // Action non fournie
            echo json_encode(['success' => false, 'message' => 'Action non fournie']);
        }
    } else {
        // Requête non AJAX
        echo json_encode(['success' => false, 'message' => 'Requête non autorisée']);
    }

    // Fonction pour ajouter un commentaire à la base de données
    function ajouterCommentaire() {
        // Connexion à la base de données
        $bd = getBD();
        
        // Récupérer les données du formulaire
        $id_user = $_SESSION['client']['id_user']; // Supposons que l'ID de l'utilisateur est stocké en session
        $id_commentaire_parent = isset($_POST['id_commentaire_parent']) ? $_POST['id_commentaire_parent'] : null;
        $id_type = $_POST['id_type'];
        $imdb_id = $_POST['imdb_id'];
        $contenu = $_POST['contenu'];
        $date = date('Y-m-d H:i:s'); // Date actuelle
    
        // Préparer et exécuter la requête SQL pour insérer le commentaire dans la base de données
        $sql = "INSERT INTO commentaire (id_user, id_commentaire_parent, id_type, imdb_id, contenu, date) VALUES (:id_user, :id_commentaire_parent, :id_type, :imdb_id, :contenu, :date)";
        $stmt = $bd->prepare($sql);
        $stmt->bindParam(':id_user', $id_user, PDO::PARAM_INT);
        $stmt->bindParam(':id_commentaire_parent', $id_commentaire_parent, PDO::PARAM_INT);
        $stmt->bindParam(':id_type', $id_type, PDO::PARAM_STR);
        $stmt->bindParam(':imdb_id', $imdb_id, PDO::PARAM_STR);
        $stmt->bindParam(':contenu', $contenu, PDO::PARAM_STR);
        $stmt->bindParam(':date', $date, PDO::PARAM_STR);
    
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Commentaire ajouté avec succès']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'ajout du commentaire']);
        }
    
        // Fermer la connexion à la base de données
        $bd = null;
    }
    

    // Fonction pour récupérer les commentaires de la base de données
    function recupererCommentaires() {
        $bd = getBD();
        // Récupérer les données du formulaire
        $id_type = $_POST['id_type'];
        $imdb_id = $_POST['imdb_id'];
        error_log($id_type);
        error_log($imdb_id);

        // Préparer et exécuter la requête SQL pour récupérer les commentaires de la base de données
        // Récupérer les commentaires parents
        $sql = "SELECT c.id_commentaire,c.id_commentaire_parent, c.contenu, c.date, u.username, 
        COUNT(r.id_commentaire) AS nb_reponses
        FROM commentaire c
        LEFT JOIN users u ON c.id_user = u.id_user
        LEFT JOIN commentaire r ON c.id_commentaire = r.id_commentaire_parent
        WHERE c.id_type = :id_type AND c.imdb_id = :imdb_id
        GROUP BY c.id_commentaire";
        $stmt = $bd->prepare($sql);
        $stmt->bindParam(':id_type', $id_type);
        $stmt->bindParam(':imdb_id', $imdb_id);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['success' => true, 'commentaires' => $result]);

      

    

    }
?>
