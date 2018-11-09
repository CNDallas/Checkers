<?php
  include("config.php");
  session_start();
  $error = array();

  if(isset($_SESSION['login'])){
     header("Location: ../dashboard/userHome.php");
     die();
  }

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

    if(strlen($user) < 3){
      array_push($error, "Username needs to be at least 3 characters");
    }

    if(strlen($user) > 16){
      array_push($error, "Username can not be more than 16 characters");
    }

    if(strlen($pass) < 6){
      array_push($error, "Password needs to be at least 6 characters");
    }

    if(strlen($pass) > 16){
      array_push($error, "Password can not be more than 16 characters");
    }

    if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
      array_push($error, "Not a valid email address");
    }

    $mysql = "SELECT * FROM users WHERE username = '$user' OR email = '$email' LIMIT 1";
    $result = mysqli_query($database, $mysql);
    $userexists = mysqli_fetch_array($result, MYSQLI_ASSOC);

    if($userexists){
      if($userexists['username'] === $user){
        array_push($error, "Username taken already");
      }
      if($userexists['email'] === $email){
        array_push($error, "Email already associated with an account");
      }
    }


    if(count($error) == 0){
      $passtostore = password_hash($pass, PASSWORD_DEFAULT);
      $sqlquery = "INSERT INTO users (username, password, email)
                   VALUES('$user', '$passtostore', '$email')";
      mysqli_query($database, $sqlquery);
      $_SESSION['login'] = $user;
      $_SESSION['message'] = "Added user to database";
      header('location: ../dashboard/userHome.php');
      die();
    }

  }

 ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Fact Checkers - Register</title>
</head>
<body>
  <h1>Fact Checkers - Register</h1>
  <p>Already have an account? <a href="login.php">Login</a></p>
  <form action="" method="POST">
    <fieldset>
      <legend>Register</legend>
      <label for="username">Username:</label>
      <input type="text" name="username" id="username" value="<?php echo $user; ?>" maxlength="16" minlength="3" required pattern="[a-zA-Z0-9]+{3,16}"/>
      <br>
      <label for="password">Password:</label>
      <input type="password" name="password" id="password" maxlength="16" minlength="6" required pattern="[a-zA-Z0-9]+{6,16}"/>
      <br>
      <label for="password2">Confirm Password:</label>
      <input type="password" name="password2" id="password2" maxlength="16" minlength="6" required pattern="[a-zA-Z0-9]+{6,16}"/>
      <br>
      <label for="email">Email:</label>
      <input type="email" name="email" id="email" maxlength ="80" required/>
      <br>
      <input type="submit" value="Submit" />
    </fieldset>
  </form>
  <div style = "font-size:12px; color:#cc0000; margin-top:10px">
    <p>
    <?php
      foreach ($error as $key => $err) {
        echo "$err<br>";
      }
    ?>
    </p>
  </div>

  <div id="backhome">
    <br>
    <br>
    <a href="index.html">Home</a>
  </div>

</body>
</html>
