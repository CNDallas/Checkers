<?php
  define('DB_SERVER', 'proj-319-048.misc.iastate.edu' );
  define('DB_USERNAME', 'rmhilby');
  define('DB_PASSWORD', 'black12');
  define('DB_DATABASE', 'factcheckers');
  $database = mysqli_connect(DB_SERVER,DB_USERNAME,DB_PASSWORD,DB_DATABASE);
  if(!$database){
    die("error:" . mysqli_connect_error());
  }
?>
