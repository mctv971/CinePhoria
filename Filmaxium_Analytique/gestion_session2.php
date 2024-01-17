<?php
session_start();
$_SESSION['selectedMovieId2'] = $_POST['movieId'];
echo 'Success';
?>