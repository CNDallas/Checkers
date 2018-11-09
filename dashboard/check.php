<?php

   include('config.php');
   session_start();

   $user = $_SESSION['login'];


  $mysql = "SELECT * FROM users WHERE username = '$user'";
  $result = mysqli_query($database, $mysql);
  $row = mysqli_fetch_array($result, MYSQLI_ASSOC);

  $matches = mysqli_num_rows($result);

   if(!isset($_SESSION['login']) || $matches == 0){
      header("Location: ../login/login.php");
      die();

   }
?>
