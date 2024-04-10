<?php
function getBD(){
$bdd = new PDO('mysql:host=localhost;dbname=Filmaxium;charset=utf8',
'root', '');
return $bdd;
}
?>