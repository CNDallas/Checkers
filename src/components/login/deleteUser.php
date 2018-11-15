<?php
include('config.php');
session_start();

$user = $_SESSION['login'];


$mysql = "DELETE FROM users WHERE username = '$user'";
$result = mysqli_query($database, $mysql);

header("Location: ../index.html");
die();


 ?>
