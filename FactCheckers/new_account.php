<?php
  include("config.php");
  session_start();
  $error = array();
  #header("location: userHome.html");
  if($_SERVER["REQUEST_METHOD"] == "POST") {

    $user = mysqli_real_escape_string($database, $_POST['username']);
    $pass = mysqli_real_escape_string($database, $_POST['password']);
    $pass2 = mysqli_real_escape_string($database, $_POST['password2']);
    $email = mysqli_real_escape_string($database, $_POST['email']);

    if(empty($user)){
      array_push($error, "Username is required");
    }
    if(empty($pass)){
      array_push($error, "Password is required");
    }
    if(empty($pass2)){
      array_push($error, "Password confirmation is required");
    }
    if(empty($email)){
      array_push($error, "Email is required");
    }
    if($pass != $pass2){
      array_push($error, "Passwords do not match");
    }

    $mysql = "SELECT idusers FROM users WHERE username = '$user' and password = '$pass'";
    $result = mysqli_query($database, $mysql);
    $row = mysqli_fetch_array($result, MYSQLI_ASSOC);

    $matches = mysqli_num_rows($result);

    if($matches == 1){
      #session_register("user");
      $_SESSION['login'] = $user;
      header("Location: userHome.html");
      die();
      #$error = "correct";
    }
    else {
      $error = "Incorrect username/password";
    }

  }

 ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>New Account</title>
</head>
<body>
  <form action="" method="POST">
    <fieldset>
      <legend>Register</legend>
      <label for="username">Username:</label>
      <input type="text" name="username" id="username" value="<?php echo $user; ?>" maxlength="16" minlength="3" required pattern="[a-zA-Z0-9]+"/>

      <label for="password">Password:</label>
      <input type="password" name="password" id="password" maxlength="16" minlength="6" required pattern="[a-zA-Z0-9]+"/>

      <label for="password2">Confirm Password:</label>
      <input type="password" name="password2" id="password2" maxlength="16" minlength="6" required pattern="[a-zA-Z0-9]+"/>

      <label for="email">Email:</label>
      <input type="email" name="email" id="email" maxlength ="80" required/>
      <input type="submit" value="Submit" />
    </fieldset>
  </form>


</body>
</html>
