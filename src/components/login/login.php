<?php
  include("config.php");
  session_start();
  #header("location: userHome.html");
  if(isset($_SESSION['login'])){
     header("Location: ../dashboard/userHome.php");
    die();
  }

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

 ?>
 <!DOCTYPE html>
 <html lang="en">
 <head>
     <meta charset="UTF-8">
     <title>Fact Checkers - Login</title>
 </head>
 <body>
   <h1>Fact Checkers - Login</h1>
   <p>Haven't created an account yet? <a href="new_account.php">Register now!</a></p>


   <form action="" method="POST">
     <fieldset>
       <legend>Login</legend>
       <label for="username">Username:</label>
       <input type="text" name="username" id="username" value="<?php echo $user; ?>" maxlength="16" required/>

       <label for="password">Password:</label>
       <input type="password" name="password" id="password" maxlength="16" required/>

       <input type="submit" value="Submit" />
     </fieldset>
   </form>
    <div style = "font-size:12px; color:#cc0000; margin-top:10px">
      <p>
        <?php echo $error;?>
      </p>
    </div>

    <div id="backhome">
      <br>
      <br>
      <a href="index.html">Home</a>
    </div>
 </body>
</html>
