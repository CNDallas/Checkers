import React, { Component } from "react";
import { AUTHENTICATE, REQUEST_STATS, LOGOUT } from "../api/Events";
import "../App.css";
import "./css/NavBar.css";
import io from "socket.io-client";
import Dashboard from "./Dashboard";
import Checkers from "./Checkers";
import Chat from "./Chat";
import Stats from "./Stats";
import Login from "./Login";
import Register from "./Register";
import uuidv4 from "uuid/v4";
import path from "path";
const socketUrl = path.join(__dirname);
//const socketUrl = "localhost:8081"

class Controller extends Component {
  state = {
    socket: null,
    lobbyId: "dashboard",
    game: false,
    navigationBar: null,
    message: "Send Message",
    showStats: false,
    isLoaded: false,
    login: true,
    register: false,
    sessionID: "",
    stats: {}
  };

  componentWillMount() {
    this.initSocket();
  }

  initSocket = () => {
    const socket = io(socketUrl);
    const sessionID = uuidv4().substring(0, 7); //remove testing and make this work with the PHP cookie
    socket.on("connect", () => {
      console.log("Connected");
    });
    this.setState({ socket,sessionID });
  };

  moveToGame = lobbyId => {
    const game = true;
    console.log("Moving to:" + lobbyId);
    this.setState({ game, lobbyId });
  };

  moveToRegister = () => {
    const register = true;
    const login = false;
    console.log("Moving to Register page");
    this.setState({ register, login });
  };

  moveToLogin = () => {
    const register = false;
    const login = true;
    console.log("Moving to Login page");
    this.setState({ register, login });
  };

  logout = () => {
    const login = true;
    const { socket } = this.state;
    console.log("User is logged out");
    socket.emit(LOGOUT, socket.username);
    this.setState({ login });
  };

  loginAccepted = username => {
    const login = false;
    const register = false;
    let game = false;
    console.log("Move to dashboard");
    const { socket } = this.state;
    const { sessionID } = this.state;
    socket.emit(AUTHENTICATE, sessionID, username, cb =>{
      if (cb !== "dashboard") {
        game = true;
      }
      const lobbyId = cb;
      this.setState({ login, register, game, lobbyId });
    });
    socket.username = username;
  };

  updateNavigationBar = navigationBar => {
    this.setState({ navigationBar });
  };

  exitGameHandler = () => {
    //TODO Need to send information to server
    const lobbyId = "Dashboard";
    const game = false;
    this.setState({ game, lobbyId });
  };

  viewStatsHandler = () => {
    const { socket } = this.state;
    let stats;
    console.log("Viewing Stats");
    console.log(socket.username);
    socket.emit(
      REQUEST_STATS,
      socket.username,
      (ranking,total_games, wins, total_kings) => {
        stats = {
          username: socket.username,
          ranking: ranking,
          total_games: total_games,
          wins: wins,
          total_kings: total_kings
        };
        console.log("Stats have been loaded");
        this.setState({ showStats: true, stats });
      }
    );
  };

  closeStatsHandler = () => {
    this.setState({ showStats: false });
  };

  pmHandler = username => {
    console.log("PMING");
    const pmUsername = "/w " + username + " ";
    this.setState({ message: pmUsername });
  };

  onMessageChangeHandler = event => {
    const sendMessage = event.target.value;
    this.setState({ message: sendMessage });
  };

  messageOnClickHandler = e => {
    if (e.target.value === "Send Message") {
      this.displayMessage("");
    }
  };
  displayMessage = message => {
    this.setState({ message });
  };

  render() {
    const {
      socket,
      navigationBar,
      lobbyId,
      game,
      message,
      showStats,
      login,
      stats,
      register
    } = this.state;
    let mainDisplay = (
      <Dashboard
        socket={socket}
        moveToGame={this.moveToGame}
        logout={this.logout}
        updateNavigationBar={this.updateNavigationBar}
        pm={this.pmHandler}
        viewStatsHandler={this.viewStatsHandler}
      />
    );
    if (game) {
      mainDisplay = (
        <Checkers
          socket={socket}
          lobbyId={lobbyId}
          logout={this.logout}
          updateNavigationBar={this.updateNavigationBar}
          exitGame={this.exitGameHandler}
          viewStatsHandler={this.viewStatsHandler}
        />
      );
    }
    if (login) {
      mainDisplay = (
        <Login
          socket={socket}
          updateNavigationBar={this.updateNavigationBar}
          loginAccepted={this.loginAccepted}
          moveToRegister={this.moveToRegister}
        />
      );
    }
    if (register) {
      mainDisplay = (
        <Register
          socket={socket}
          updateNavigationBar={this.updateNavigationBar}
          loginAccepted={this.loginAccepted}
          moveToLogin={this.moveToLogin}
        />
      );
    }

    return (
      <div className="App">
        <div className="banner">
          <span className="header"> Checkers</span>
        </div>
        {navigationBar}
        <div className="main">
          <Stats
            show={showStats}
            handleClose={this.closeStatsHandler}
            stats={stats}
          />
          {mainDisplay}
          <Chat
            socket={socket}
            message={message}
            onChange={this.onMessageChangeHandler}
            onClick={this.messageOnClickHandler}
            displayMessage={this.displayMessage}
          />
        </div>
      </div>
    );
  }
}

export default Controller;
