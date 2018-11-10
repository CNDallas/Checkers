import React, {Component} from 'react'
import {CREATE_GAME} from '../api/Events'
import OpenGameCard from './OpenGameCard'
//import NavBar from "./NavBar"
import "./css/Dashboard.css"
import "tachyons"


class Dashboard extends Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			games: {Name: "Name"}

		}
	}


	createGame() {
		//const games = ["Name"]
		this.props.socket.emit(CREATE_GAME, "Filler Name", (games) => {
			this.setState(games)
		})
	}


	render() {
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