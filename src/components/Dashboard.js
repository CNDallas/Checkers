import React, {Component} from 'react'
import {CREATE_GAME, IS_GAME_OPEN, REFRESH_LOBBY} from '../api/Events';
import OpenGameCard from './OpenGameCard'
import "./css/Dashboard.css"
import "tachyons"
import NavBar from "./NavBar"

class Dashboard extends Component {

	refreshLobbyHandler = () => {
		const {socket} = this.props;
		socket.emit(REFRESH_LOBBY, this.updateLobby)
	};

	updateLobby = (gameLobbies) => {
		console.log(gameLobbies);
		this.setState({isDataFetched : true});
		this.setState(gameLobbies);
	};

	createGameHandler = () => {
		const { socket } = this.props;
		socket.emit(CREATE_GAME, socket.username, (lobbyId) => {
			this.props.moveToGame(lobbyId)
		})
	};

	joinGameHandler = (Id) => {
		const {socket} = this.props;
		console.log(Id);
		socket.emit(IS_GAME_OPEN, Id, (isOpen) => {
			if (isOpen) {
				this.props.moveToGame(Id)
			}
		});
	};


	viewStats = () => {
		//TODO
	};

	renderGames = (gameLobbies) => {
		return (
			!this.state.isDataFetched ? null : (
				gameLobbies.length ===  0 ?
				<h1 className='white'>No games found. Why not create one</h1>:
				gameLobbies.map(games =>
					<OpenGameCard key={games.Id} host={games.hostname} id={games.Id} joinGame={this.joinGameHandler.bind(this,games.Id)}/>
				)
			)
		);
	};

	constructor(props, context) {
		super(props, context);
		this.refreshLobbyHandler();
		this.state = {
			gameLobbies: [],
			createGame: false,
			isDataFetched: false
		};
	}

	render() {
		const {gameLobbies} = this.state;
		let cards = this.renderGames(gameLobbies);

		return (
			<React.Fragment>
				<div className="navigation" >
					<NavBar creategame = {this.createGameHandler} refreshlobby = {this.refreshLobbyHandler} viewstats= {this.viewStats} logout= {this.props.logout}/>
				</div>
				<div className="cards">
					{cards}
				</div>
			</React.Fragment>
		);
	}
}

export default Dashboard;
