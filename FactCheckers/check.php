<?php
   include('config.php');
   session_start();

   $user = $_SESSION['login'];

   $sql = mysqli_query($db,"SELECT username FROM users WHERE username = '$user' ");
   $result = mysqli_fetch_array($sql,MYSQLI_ASSOC);

   $matches = mysqli_num_rows($result);
  

   if(!isset($_SESSION['login']) || $row == 1){
      header("Location: login.php");
   }
?>
