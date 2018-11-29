<?php
header ("Access-Control-Allow-Origin: *");
header ("Access-Control-Expose-Headers: Content-Length, X-JSON");
header ("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
header ("Access-Control-Allow-Headers: *");
  include("config.php");
  session_start();
  #header("location: userHome.html");

  $json = file_get_contents('php://input');
  $obj = json_decode($json, true);

  $user = $obj['username'];
  $textpass = $obj['password'];

  $mysql = "SELECT * FROM users WHERE username = '$user'";
  $result = mysqli_query($database, $mysql);
  $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
  $matches = mysqli_num_rows($result);


  if($matches == 1 && password_verify($textpass, $row['password'])){
    #session_register("user");

    $SuccessLoginMsg = 'Data Matched';

 // Converting the message into JSON format.
    $SuccessLoginJSon = json_encode($SuccessLoginMsg);

// Echo the message.
    echo $SuccessLoginJSon ;



    $_SESSION['login'] = $user;
    //header("Location: ../dashboard/userHome.php");

    die();
    #$error = "correct";
  }
  else {
    // If the record inserted successfully then show the message.
    $userJSON =  json_encode($user);
    echo $userJSON;
    $InvalidMSG = 'Invalid Username or Password Please Try Again' ;

// Converting the message into JSON format.
    $InvalidMSGJSon = json_encode($InvalidMSG);

// Echo the message.
    //echo $InvalidMSGJSon ;
    $error = "Incorrect username/password";
  }

  if(isset($_SESSION['login'])){
  //   header("Location: ../dashboard/userHome.php");
    die();
  }
/*
  if($_SERVER["REQUEST_METHOD"] == "POST") {

    $user = mysqli_real_escape_string($database, $_POST['username']);
    $textpass = mysqli_real_escape_string($database, $_POST['password']);

    $mysql = "SELECT * FROM users WHERE username = '$user'";
    $result = mysqli_query($database, $mysql);
    $row = mysqli_fetch_array($result, MYSQLI_ASSOC);

    $matches = mysqli_num_rows($result);

    if($matches == 1 && password_verify($textpass, $row['password'])){
      #session_register("user");

      $_SESSION['login'] = $user;
      header("Location: ../dashboard/userHome.php");
      die();
      #$error = "correct";
    }
    else {
      $error = "Incorrect username/password";
    }

  }
*/
 ?>
