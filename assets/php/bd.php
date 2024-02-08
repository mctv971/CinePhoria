<?php
function getBD(){
$bdd = new PDO('mysql:host=localhost;dbname=filmaxium;charset=utf8',
'root', '');
return $bdd;
}
?>