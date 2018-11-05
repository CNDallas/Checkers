<?php
  include("config.php");
  session_start();
  #header("location: userHome.html");
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
      header("Location: userHome.html");
      die();
      #$error = "correct";
    }
    else {
      $error = "Incorrect username/password";
    }

  }

 ?>
 <html>
 <head>
   <title>Fact Checkers</title>
 </head>
 <body>
   <h1>Fact Checkers - Login</h1>
   <p>Use rh as username and abc as password </p>

   <p>TODO: Create an Account</p>
   <form action="" method="POST">
     <fieldset>
       <legend>Login</legend>
       <label for="username">Username:</label>
       <input type="text" name="username" id="username" maxlength="16" required/>

       <label for="password">Password:</label>
       <input type="password" name="password" id="password" maxlength="16" required/>

       <input type="submit" value="Submit" />
     </fieldset>
   </form>
    <div style = "font-size:11px; color:#cc0000; margin-top:10px"><p><?php echo $error;?></p></div>
 </body>
</html>
