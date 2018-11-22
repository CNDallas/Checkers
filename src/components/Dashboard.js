import React, {Component} from 'react';
import {CREATE_GAME, IS_GAME_OPEN, REFRESH_LOBBY} from '../api/Events';
import OpenGameCard from './OpenGameCard';
import "./css/Dashboard.css";
import "tachyons";
import NavBar from "./NavBar";
import "../App.css";
import uuidv4 from 'uuid/v4';

class Dashboard extends Component {

	state = {
		gameLobbies: [],
		createGame: false,
		isDataFetched: false
	};

	componentDidMount(){
		this.refreshLobbyHandler();
		this.navigationBarUpdater();
	};

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
			} else {
				this.refreshLobbyHandler();
			}
		});
	};


	viewStats = () => {
		//TODO
	};

	renderGames = (gameLobbies) => {
		if (!this.state.isDataFetched) {
			return null;
		}
		else if (gameLobbies.length === 0) {
			return <h1>No games found. Why not create one</h1>
		} else {
			return (
				gameLobbies.map(games => (
					<span className='card' key={games.Id + "span"}>
							<OpenGameCard key={games.Id} host={games.hostname} id={games.Id}
							              joinGame={this.joinGameHandler.bind(this, games.Id)}/>
						</span>
				))
			)
		}
	};

	navigationBarUpdater = () => {
		const navItems = [
			{func: this.createGameHandler, text: 'CreateGame', key: uuidv4()},
			{func: this.refreshLobbyHandler, text: 'Refresh Lobby', key: uuidv4()},
			{func: this.viewStats, text: 'View Stats', key: uuidv4()},
			{func: this.props.logout, text: 'Logout', key: uuidv4()}
		];
		const nBar = <NavBar linkItems={navItems}/>;
		this.props.updateNavigationBar(nBar);
	};

	render() {
		const {gameLobbies} = this.state;
		let cards = this.renderGames(gameLobbies);
		return (
			<div className="cards">
					{cards}
				</div>
		);
	}
}

export default Dashboard;
