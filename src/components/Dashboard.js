import React, {Component} from 'react'
import {CREATE_GAME, JOIN_GAME, REFRESH_LOBBY, UPDATE_LOBBY} from '../api/Events'
import OpenGameCard from './OpenGameCard'
import "./css/Dashboard.css"
import "tachyons"
import NavBar from "./NavBar"
import io from "socket.io-client"

class Dashboard extends Component {

	refreshLobby = () => {
		const {socket} = this.props
		socket.emit(REFRESH_LOBBY, this.updateLobby)
	}

	updateLobby = (gameLobbies) => {
		console.log(gameLobbies)
		this.setState(gameLobbies)
	}

	createGame = () => {
		const { socket } = this.props
		//const game = true;
		socket.emit(CREATE_GAME, socket.username)
	}

	joinGame = (event) => {
		const { socket } = this.props
		//const game = true;
		socket.emit(JOIN_GAME, event.target.value)
		this.setState({socket})
	}
	joinLobby = () => {
		const lobby = true
		const socket  = io('/dashboard')
		this.setState({lobby, socket})
	}

	logout = () => {
		//TODO
	}

	viewStats = () => {
		//TODO
	}

	renderGames = (lobby) => {
		const {socket} = this.props
		return <OpenGameCard socket = {socket} host={lobby.host}/>
	}

	constructor(props, context) {
		super(props, context)
		this.state = {
			gameLobbies: [],
			createGame: false
		}
	}

	render() {
		const {gameLobbies} = this.state;
		const {socket} = this.props
		var cards = gameLobbies.map(games =>
				<OpenGameCard socket = {socket} host= {games.hostname}/>
	)
		return (
			<React.Fragment>
				<div className="navigation" >
					<NavBar socket={socket} creategame = {this.createGame} refreshlobby = {this.refreshLobby} viewstats= {this.viewStats} logout= {this.logout}/>
				</div>
				<div className="cards">
					{cards}


				</div>
			</React.Fragment>
		);
	}
}

export default Dashboard;
