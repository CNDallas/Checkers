import React, {Component} from 'react'
import 'tachyons'
import "./css/Checkers.css"
import uuidv4 from "uuid/v4";
import NavBar from "./NavBar";

class Checkers extends Component {
	constructor(props, context) {
		super(props, context);
		this.navigationBarUpdater();
	};

	navigationBarUpdater = () => {
		const navItems = [
			{func: this.props.exitGame, text: 'Exit Game', key: uuidv4()},
			{func: this.viewStats, text: 'View Stats', key: uuidv4()},
			{func: this.props.logout, text: 'Logout', key: uuidv4()}
		];
		const nBar = <NavBar linkItems={navItems}/>;
		this.props.updateNavigationBar(nBar)
	};


	render(){
		const {lobbyId} = this.props;
		return (
			<div>
		CHECKERS! - {lobbyId}
			</div>

		)}
}

export default Checkers;
