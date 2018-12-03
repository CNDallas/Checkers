import React, { Component } from "react";


import uuidv4 from "uuid/v4";
import NavBar from "./NavBar";

class Login extends Component {
  constructor(props, context) {
    super(props, context);
    this.navigationBarUpdater();
    this.state = {
      loginUsername: "",
      loginPassword: "",
      error: ""
    };
    this.handleChangeEvents = this.handleChangeEvents.bind(this);
    this.attemptAlreadyLoggedIn();
  }

  navigationBarUpdater = () => {
    const navItems = [
      { func: this.props.moveToRegister, text: "Register", key: uuidv4() }
    ];
    const nBar = <NavBar linkItems={navItems} />;
    this.props.updateNavigationBar(nBar);
  };

  handleChangeEvents(event) {
    const targetName = event.target.name;
    const value = event.target.value;
    //console.log(targetName);
    this.setState({ [targetName]: value });
  }

  attemptAlreadyLoggedIn() {
    console.log("check");
    //console.log(e);
    fetch("http://proj-319-048.misc.iastate.edu/js/login.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: JSON.stringify({
        username: "a",
        password: "a"
      })
    })
      .then(response => response.json())
      .then(responseJSon => {
        if (responseJSon === "Invalid Username or Password Please Try Again") {
          console.log("Not logged in already.");
        } else {
          console.log(responseJSon);
          this.props.loginAccepted(responseJSon);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  LoginFunction = e => {
    e.preventDefault();
    const { loginUsername } = this.state;
    const { loginPassword } = this.state;

    //console.log(e);
    fetch("http://proj-319-048.misc.iastate.edu/js/login.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: JSON.stringify({
        username: loginUsername,
        password: loginPassword
      })
    })
      .then(response => response.json())
      .then(responseJSon => {
        if (responseJSon === "Data Matched") {
          console.log("match");
          this.props.loginAccepted(loginUsername);
        } else {
          console.log(responseJSon);
          this.setState({ error: responseJSon });
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    return (
      <div>
        <span
          style={{
            display: "block",
            fontSize: "2em",
            paddingTop: ".5em",
            paddingBottom: "1em"
          }}
        >
          Login
        </span>
        <form onSubmit={this.LoginFunction}>
          <fieldset>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              onChange={this.handleChangeEvents}
              name="loginUsername"
              id="username"
              defaultValue=""
              maxLength="16"
              required
            />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              onChange={this.handleChangeEvents}
              name="loginPassword"
              id="password"
              maxLength="16"
              required
            />

            <input type="submit" defaultValue="Submit" />
          </fieldset>
        </form>
        <div style={{ fontSize: "12px", color: "#cc0000", marginTop: " 10px" }}>
          <p>{this.state.error}</p>
        </div>
      </div>
    );
  }
}

export default Login;
