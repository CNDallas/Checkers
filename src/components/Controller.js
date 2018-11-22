import React, {Component} from 'react'
import {AUTHENTICATE} from '../api/Events'
import "../App.css"
import "./css/NavBar.css";
import io from 'socket.io-client'
import Dashboard from './Dashboard'
import Checkers from './Checkers'
import uuidv4 from 'uuid/v4'
const socketUrl = "http://localhost:8081";




class Controller extends Component {

	state = {
		socket: null,
		lobbyId: "Dashboard",
		game: false,
		navigationBar: null
	};

	componentWillMount() {
		this.initSocket()
	}

	initSocket = () => {
		const socket = io(socketUrl);
		const sessionID = uuidv4().substring(0,7); //remove testing and make this work with the PHP cookie
		const username = "User" + uuidv4().substring(0,7); //remove testing and make this work with the PHP cookie
		socket.on('connect', () => {
			console.log("Connected")
		});
		socket.emit(AUTHENTICATE, sessionID, username);
		socket.username = username;
		this.setState({socket})
	};

	moveToGame = (lobbyId) => {
		const game = true;
		console.log("Moving to:" + lobbyId);
		this.setState({game, lobbyId})
	};

	logout = () => {
		//TODO
	};

	updateNavigationBar = (navigationBar) => {
		this.setState({navigationBar});
	};

	exitGameHandler = () => { //TODO Need to send information to server
		const lobbyId = "Dashboard";
		const game = false;
		this.setState({game,lobbyId});
	};


	render() {
		const {socket, navigationBar, lobbyId, game} = this.state;
		let mainDisplay = <Dashboard socket={socket} moveToGame={this.moveToGame} logout={this.logout} updateNavigationBar={this.updateNavigationBar}/>;
			if (game) {
				mainDisplay = <Checkers socket={socket} lobbyId={lobbyId} updateNavigationBar={this.updateNavigationBar} exitGame={this.exitGameHandler}/>;
			}

		return (
			<div className="App"><div className='banner'></div>{navigationBar}<div className='main'>{mainDisplay}</div></div>
		);
	}

}

export default Controller;
