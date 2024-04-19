<?php
function getBD(){
$bdd = new PDO('mysql:host=localhost;dbname=Filmaxium2;charset=utf8',
'root', 'root');
return $bdd;
}
?>