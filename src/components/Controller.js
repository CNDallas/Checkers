import React, {Component} from 'react'
import {JOIN_LOBBY, LOGOUT} from '../api/Events'
import io from 'socket.io-client'
import Dashboard from './Dashboard'
//import Login from './Login'

const socketUrl = "http://localhost:8081"
class Controller extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			socket: null,
			player: null
		};
	}

	componentWillMount() {
		this.initSocket()
	}

	initSocket = () => {
		const socket = io(socketUrl)

		socket.on('connect', () => {
			console.log("Connected")
		})
		this.setState({socket})
	}

	setLogin = (name) => {
		const {socket} = this.state
		socket.emit(JOIN_LOBBY, name)
		this.setState({name})
	}

	logout = () => {
		const {socket} = this.state
		socket.emit(LOGOUT)
		this.setState({name: null})
	}


	render() {
		const {socket} = this.state;
		return (
			<div className="display">
				{
					//!name?
					//<Login socket={socket} setLogin={this.setLogin}/>:
					<Dashboard socket ={socket} name={this.setLogin} logout={this.logout} />

				}
			</div>
		);
	}

}

export default Controller;