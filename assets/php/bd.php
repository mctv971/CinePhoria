<?php
/**
 * Établit une connexion à la base de données MySQL en utilisant PDO.
 * Cette fonction crée une nouvelle instance de PDO pour se connecter à une base de données spécifique
 * sur un serveur local. Elle retourne l'objet PDO qui permettra d'effectuer des requêtes sur cette base de données.
 * Les informations de connexion (comme le nom de la base, l'hôte, le nom d'utilisateur et le mot de passe) sont codées en dur,
 * ce qui peut nécessiter une modification pour l'adaptation à d'autres environnements ou pour des raisons de sécurité.
 *
 * @return PDO L'objet PDO représentant la connexion à la base de données.
 */
function getBD(){
$bdd = new PDO('mysql:host=localhost;dbname=Filmaxium2;charset=utf8',
'root', 'root');
return $bdd;
}
?>