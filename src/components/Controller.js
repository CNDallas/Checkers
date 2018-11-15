import React, {Component} from 'react'
import {AUTHENTICATE, CREATE_GAME, JOIN_GAME} from '../api/Events'
import io from 'socket.io-client'
import Dashboard from './Dashboard'

const socketUrl = "http://localhost:8081"
class Controller extends Component {

	initSocket = () => {
		const socket = io(socketUrl)
		const sessionID = "TestID" //remove testing and make this work with the PHP cookie
		const username = "TestUser" //remove testing and make this work with the PHP cookie
		socket.on('connect', () => {
			console.log("Connected")
		})
		socket.on(AUTHENTICATE, sessionID, username)
		socket.username = username
		console.log(socket.username)
		this.setState({socket})
	}
	constructor(props, context) {
		super(props, context);
		this.state = {
			socket: null,
			game: false,
			lobby: true
		};
	}

	componentWillMount() {
		this.initSocket()
	}



	render() {
		const {socket, game, lobby} = this.state
		return (
			<div className="display">
				{
					//!name?
					//<Login socket={socket} setLogin={this.setLogin}/>:
					<Dashboard socket={socket} createGame={this.createGame} joinGame={this.joinGame}/>

				}
			</div>
		);
	}

}

export default Controller;
