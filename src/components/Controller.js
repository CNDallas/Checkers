import React, {Component} from 'react'
import {AUTHENTICATE} from '../api/Events'
import io from 'socket.io-client'
import Dashboard from './Dashboard'
import Checkers from './Checkers'
const socketUrl = "http://localhost:8081";
class Controller extends Component {

	initSocket = () => {
		const socket = io(socketUrl);
		const sessionID = "TestID"; //remove testing and make this work with the PHP cookie
		const username = "TestUser"; //remove testing and make this work with the PHP cookie
		socket.on('connect', () => {
			console.log("Connected")
		});
		socket.on(AUTHENTICATE, sessionID, username);
		socket.username = username;
		console.log(socket.username);
		this.setState({socket})
	};

	moveToGame = (lobbyId) => {
		const game = true;
		console.log("Moving to:" + lobbyId);
		this.setState({game, lobbyId})
	};

	constructor(props, context) {
		super(props, context);
		this.state = {
			socket: null,
			lobbyId: '',
			game: false,
		};
	}

	componentWillMount() {
		this.initSocket()
	}



	render() {
		const {socket, lobbyId, game} = this.state;
		return (
			<div className="display">
				{
					!game?<Dashboard socket={socket} moveToGame={this.moveToGame} />:
						<Checkers socket={socket} lobbyId = {lobbyId}/>
					//<Login socket={socket} setLogin={this.setLogin}/>:
				}
			</div>
		);
	}

}

export default Controller;
