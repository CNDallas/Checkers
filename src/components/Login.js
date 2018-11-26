import React, {Component} from 'react'
import {AUTHENTICATE} from '../api/Events';
import 'tachyons'

import uuidv4 from "uuid/v4";
import NavBar from "./NavBar";

class Login extends Component {

  constructor(props, context) {
		super(props, context);
		this.navigationBarUpdater();
		this.state = {
      loginUsername: '',
      loginPassword: ''
		};
	};


	navigationBarUpdater = () => {
		const navItems = [
			{func: this.props.exitGame, text: 'Exit Game', key: uuidv4()},
			{func: this.viewStats, text: 'View Stats', key: uuidv4()},
			{func: this.props.logout, text: 'Logout', key: uuidv4()}
		];
		const nBar = <NavBar linkItems={navItems}/>;
		this.props.updateNavigationBar(nBar)
	};

  LoginFunction = () => {
    const {loginUsername} = this.state;
    const {loginPassword} = this.state;

    fetch('login.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: loginUsername,
        password: loginPassword
      })
    }).then((response) => response.json())
      .then((responseJSon) => {
        if(responseJSon === 'Data Matched'){
          console.log("match");
        }
        else {
          console.log(responseJSon);
        }
      }).catch((error) => {
        console.error(error);
      });
    }

    render(){
      return(

        <html lang="en">
        <head>
            <meta charset="UTF-8"></meta>
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

             </p>
           </div>

           <div id="backhome">
             <br></br>
             <br></br>
             <a href="index.html">Home</a>
           </div>
        </body>
       </html>
      );
    }
  }





export default Login;
