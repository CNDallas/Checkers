import React, {Component} from 'react'
import {AUTHENTICATE} from '../api/Events'
import "../App.css"
import io from 'socket.io-client'
import Dashboard from './Dashboard'
import Checkers from './Checkers'
import uuidv4 from 'uuid/v4'
const socketUrl = "http://localhost:8081";



class Controller extends Component {

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
		this.setState({navigationBar})
	};

	constructor(props, context){
		super(props, context);
		this.state = {
			socket: null,
			lobbyId: '',
			game: false,
			navigationBar: null
		}
	}

	componentWillMount() {
		this.initSocket()
	}



	render() {
		const {socket, navigationBar, lobbyId, game} = this.state;
		let mainDisplay = <Dashboard socket={socket} moveToGame={this.moveToGame} logout={this.logout} updateNavigationBar={this.updateNavigationBar}/>;
			if (game) {
				mainDisplay = <Checkers socket={socket} lobbyId={lobbyId} updateNavigationBar={this.updateNavigationBar}/>;
			}

		return (
			<React.Fragment><div className='navigation'>{navigationBar}</div><div className='main'>{mainDisplay}</div>></React.Fragment>
		);
	}

}

export default Controller;
