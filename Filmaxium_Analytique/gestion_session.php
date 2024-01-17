<?php
session_start();
$_SESSION['selectedMovieId'] = $_POST['movieId'];
echo 'Success';
?>