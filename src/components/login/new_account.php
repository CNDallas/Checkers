<?php
header ("Access-Control-Allow-Origin: *");
header ("Access-Control-Expose-Headers: Content-Length, X-JSON");
header ("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
header ("Access-Control-Allow-Headers: *");
  include("config.php");
  session_start();
  $error = array();

  $json = file_get_contents('php://input');
  $obj = json_decode($json, true);

/*  if(isset($_SESSION['login'])){
     header("Location: ../dashboard/userHome.php");
     die();
  }*/



    $user = $obj['username'];
    $pass = $obj['password'];
    $pass2 = $obj['password2'];
    $email = $obj['email'];

    if(empty($user)){
      array_push($error, "Username is required\r\n");
    }
    if(empty($pass)){
      array_push($error, "Password is required\r\n");
    }
    if(empty($pass2)){
      array_push($error, "Password confirmation is required\r\n");
    }
    if(empty($email)){
      array_push($error, "Email is required\r\n");
    }
    if($pass != $pass2){
      array_push($error, "Passwords do not match\r\n");
    }

    if(strlen($user) < 3){
      array_push($error, "Username needs to be at least 3 characters\r\n");
    }

    if(strlen($user) > 16){
      array_push($error, "Username can not be more than 16 characters\r\n");
    }

    if(strlen($pass) < 6){
      array_push($error, "Password needs to be at least 6 characters\r\n");
    }

    if(strlen($pass) > 16){
      array_push($error, "Password can not be more than 16 characters\r\n");
    }

    if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
      array_push($error, "Not a valid email address\r\n");
    }

    $mysql = "SELECT * FROM users WHERE username = '$user' OR email = '$email' LIMIT 1";
    $result = mysqli_query($database, $mysql);
    $userexists = mysqli_fetch_array($result, MYSQLI_ASSOC);

    if($userexists){
      //array_push($error, (strcasecmp($userexists['username'], $user) == 0));
      if((strcasecmp($userexists['username'], $user) == 0)){
        array_push($error, "Username taken already\r\n");
      }
      if(strcasecmp($userexists['email'], $email) == 0){
        array_push($error, "Email already associated with an account\r\n");
      }
    }


    if(count($error) == 0){
      $passtostore = password_hash($pass, PASSWORD_DEFAULT);
      $sqlquery = "INSERT INTO users (username, password, email)
                   VALUES('$user', '$passtostore', '$email')";
      if(mysqli_query($database, $sqlquery)){
    //  $_SESSION['login'] = $user;
      //$_SESSION['message'] = "Added user to database";
  //    header('location: ../dashboard/userHome.php');
      $SuccessLoginMsg = 'User Registered';
    }
    else {
      array_push($error, "Error\r\n");
      $SuccessLoginMsg = $error;
    }
// Converting the message into JSON format.
      $SuccessLoginJSon = json_encode($SuccessLoginMsg);

// Echo the message.
      echo $SuccessLoginJSon ;
      die();
    }
    else {



  // Converting the message into JSON format.
      $InvalidMSGJSon = json_encode($error);
      echo $InvalidMSGJSon;
    }



 ?>
