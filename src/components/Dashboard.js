import React, {Component} from 'react'
import {REFRESH_LOBBY, UPDATE_LOBBY} from '../api/Events'
import OpenGameCard from './OpenGameCard'
import "./css/Dashboard.css"
import "tachyons"
import io from 'socket.io-client'

class Dashboard extends Component {

	refreshLobby = () => {
		this.props.socket.emit(REFRESH_LOBBY, () => {
			this.props.socket.on(UPDATE_LOBBY, (gameLobbies) => {
				this.setState(gameLobbies)
			})
		});
	}
	createGame = () => {
		this.props.createGame();
	}
	joinGame = () => {
		this.props.joinGame();
	}

	constructor(props, context) {
		super(props, context)
		this.state = {
			gameLobbies: {},
			createGame: false
		}
	}

	render() {
		const {gameLobbies} = this.state;
		return (
			<React.Fragment>
				<div className="cards">
					<OpenGameCard className="card bordered"/>
					<OpenGameCard className="card bordered"/>
					<OpenGameCard className="card bordered"/>
					<OpenGameCard className="card bordered"/>
					<OpenGameCard className="card bordered"/>

				</div>
			</React.Fragment>
		);
	}
}

export default Dashboard;
