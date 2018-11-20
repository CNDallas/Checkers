import React, {Component} from 'react'
import {CREATE_GAME, IS_OPEN, JOIN_GAME, REFRESH_LOBBY, UPDATE_LOBBY} from '../api/Events';
import OpenGameCard from './OpenGameCard'
import "./css/Dashboard.css"
import "tachyons"
import NavBar from "./NavBar"
import io from "socket.io-client"

class Dashboard extends Component {

	refreshLobby = () => {
		const {socket} = this.props;
		socket.emit(REFRESH_LOBBY, this.updateLobby)
	};

	updateLobby = (gameLobbies) => {
		console.log(gameLobbies);
		this.setState(gameLobbies)
	};

	createGame = () => {
		const { socket } = this.props;
		//const game = true;
		socket.emit(CREATE_GAME, socket.username, (lobbyId) => {
			this.props.moveToGame(lobbyId)
		})

	};

	joinGame = (Id) => {
		const { socket } = this.props;
		socket.emit(JOIN_GAME, Id);
		this.props.moveToGame(Id)
	};

	joinLobby = () => {
		const lobby = true;
		const socket  = io('/dashboard');
		this.setState({lobby, socket})
	};

	joinGameHandler = (Id) => {
		const {socket} = this.props;
		console.log(Id);
		socket.emit(IS_OPEN, Id, (isOpen) => {
			if (isOpen) {
				this.props.moveToGame(Id)
			}
		});
	};

	logout = () => {
		//TODO
	};

	viewStats = () => {
		//TODO
	};

	renderGames = (lobby) => {
		const {socket} = this.props;
		return <OpenGameCard socket = {socket} host={lobby.host}/>
	};

	constructor(props, context) {
		super(props, context);
		this.refreshLobby();
		this.state = {
			gameLobbies: [],
			createGame: false
		}
	}

	render() {
		const {gameLobbies} = this.state;
		const {socket} = this.props;
		let cards = gameLobbies.length ===  0 ?
			<h1>No games found. Why not create one</h1>:
			gameLobbies.map(games =>
				<OpenGameCard socket = {socket} key={games.hostname} host={games.hostname} id={games.Id} joinGame={this.joinGameHandler.bind(this,games.Id)}/>
	);

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
