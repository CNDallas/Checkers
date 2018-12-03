import React, { Component } from "react";
import { CREATE_GAME, JOIN_GAME, REFRESH_LOBBY } from "../api/Events";
import OpenGameCard from "./OpenGameCard";
import "./css/Dashboard.css";
import NavBar from "./NavBar";
import "../App.css";
import uuidv4 from "uuid/v4";
import util from "util";

class Dashboard extends Component {
  state = {
    gameLobbies: [],
    createGame: false,
    isDataFetched: false
  };

  componentDidMount() {
    this.refreshLobbyHandler();
    this.navigationBarUpdater();
  }

  refreshLobbyHandler = () => {
    const { socket } = this.props;
    socket.emit(REFRESH_LOBBY, this.updateLobby);
  };

  updateLobby = gameLobbies => {
    console.log("Lobby Rec: " + util.inspect(gameLobbies,{showHidden: false, depth: null}));
    this.setState({ isDataFetched: true ,gameLobbies});
  };

  createGameHandler = () => {
    const { socket } = this.props;
    socket.emit(CREATE_GAME, socket.username, lobbyId => {
      this.props.moveToGame(lobbyId);
    });
  };

  joinGameHandler = Id => {
    const { socket } = this.props;
    console.log(Id);
    socket.emit(JOIN_GAME, Id, isOpen => {
      if (isOpen) {
        this.props.moveToGame(Id);
      } else {
        this.refreshLobbyHandler();
      }
    });
  };

  pmPassUp = username => {
    this.props.pm(username);
  };

  viewStats = () => {
    //TODO
  };

  renderGames = gameLobbies => {
    if (!this.state.isDataFetched) {
      return null;
    } else if (gameLobbies.length === 0) {
      return <h1>No games found. Why not create one</h1>;
    } else {
      return gameLobbies.map(game => {
        console.log("Games" + game);
        return (
          <span className="card" key={game.lobby_id + "span"}>
            <OpenGameCard
              key={game.lobby_id}
              host={game.host_username}
              rank={game.ranking}
              joinGame={this.joinGameHandler.bind(this, game.lobby_id)}
              pm={this.pmPassUp.bind(this, game.host_username)}
              wins={game.wins}
              games={game.total_games}
              kings={game.total_kings}
            />
          </span>
        );
      });
    }
  };

  navigationBarUpdater = () => {
    const navItems = [
      { func: this.createGameHandler, text: "Create Game", key: uuidv4() },
      { func: this.refreshLobbyHandler, text: "Refresh Lobby", key: uuidv4() },
      { func: this.props.viewStatsHandler, text: "View Stats", key: uuidv4() },
      { func: this.props.logout, text: "Logout", key: uuidv4() }
    ];
    const nBar = <NavBar linkItems={navItems} />;
    this.props.updateNavigationBar(nBar);
  };

  render() {
    const { gameLobbies } = this.state;
    let cards = this.renderGames(gameLobbies);
    return <div className="cards">{cards}</div>;
  }
}

export default Dashboard;
