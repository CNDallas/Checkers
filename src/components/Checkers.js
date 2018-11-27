import React, {Component} from 'react'
import 'tachyons'
import "./css/Checkers.css"
import uuidv4 from "uuid/v4";
import NavBar from "./NavBar";
import * as checkers_client from "./checkers_client.js"; //Leaving out as it throws a bunch of errors atm



class Checkers extends Component {
	constructor(props, context) {
		super(props, context);
		this.navigationBarUpdater();

	};

	componentDidMount() {
		checkers_client.onCreate();
	};

	navigationBarUpdater = () => {
		const navItems = [
			{func: this.props.exitGame, text: 'Exit Game', key: uuidv4()},
			{func: this.props.viewStatsHandler, text: 'View Stats', key: uuidv4()},
			{func: this.props.logout, text: 'Logout', key: uuidv4()}
		];
		const nBar = <NavBar linkItems={navItems}/>;
		this.props.updateNavigationBar(nBar)
	};

	turnHTML = () => {
		return (
			<div id="turn"></div>
		)
	};

	badHTML = () => {
		return (


			<div className="gameBoard">
			<table id="board">
			<tbody>
				<tr id="row1">
					<td id="cell0" onClick={this.selectCell}></td>
					<td id="cell1" onClick={this.selectCell}></td>
					<td id="cell2" onClick={this.selectCell}></td>
					<td id="cell3" onClick={this.selectCell}></td>
					<td id="cell4" onClick={this.selectCell}></td>
					<td id="cell5" onClick={this.selectCell}></td>
					<td id="cell6" onClick={this.selectCell}></td>
					<td id="cell7" onClick={this.selectCell}></td>
				</tr>
				<tr id="row2">
					<td id="cell8" onClick={this.selectCell}></td>
					<td id="cell9" onClick={this.selectCell}></td>
					<td id="cell10" onClick={this.selectCell}></td>
					<td id="cell11" onClick={this.selectCell}></td>
					<td id="cell12" onClick={this.selectCell}></td>
					<td id="cell13" onClick={this.selectCell}></td>
					<td id="cell14" onClick={this.selectCell}></td>
					<td id="cell15" onClick={this.selectCell}></td>
				</tr>
				<tr id="row3">
					<td id="cell16" onClick={this.selectCell}></td>
					<td id="cell17" onClick={this.selectCell}></td>
					<td id="cell18" onClick={this.selectCell}></td>
					<td id="cell19" onClick={this.selectCell}></td>
					<td id="cell20" onClick={this.selectCell}></td>
					<td id="cell21" onClick={this.selectCell}></td>
					<td id="cell22" onClick={this.selectCell}></td>
					<td id="cell23" onClick={this.selectCell}></td>
				</tr>
				<tr id="row4">
					<td id="cell24" onClick={this.selectCell}></td>
					<td id="cell25" onClick={this.selectCell}></td>
					<td id="cell26" onClick={this.selectCell}></td>
					<td id="cell27" onClick={this.selectCell}></td>
					<td id="cell28" onClick={this.selectCell}></td>
					<td id="cell29" onClick={this.selectCell}></td>
					<td id="cell30" onClick={this.selectCell}></td>
					<td id="cell31" onClick={this.selectCell}></td>
				</tr>
				<tr id="row5">
					<td id="cell32" onClick={this.selectCell}></td>
					<td id="cell33" onClick={this.selectCell}></td>
					<td id="cell34" onClick={this.selectCell}></td>
					<td id="cell35" onClick={this.selectCell}></td>
					<td id="cell36" onClick={this.selectCell}></td>
					<td id="cell37" onClick={this.selectCell}></td>
					<td id="cell38" onClick={this.selectCell}></td>
					<td id="cell39" onClick={this.selectCell}></td>
				</tr>
				<tr id="row6">
					<td id="cell40" onClick={this.selectCell}></td>
					<td id="cell41" onClick={this.selectCell}></td>
					<td id="cell42" onClick={this.selectCell}></td>
					<td id="cell43" onClick={this.selectCell}></td>
					<td id="cell44" onClick={this.selectCell}></td>
					<td id="cell45" onClick={this.selectCell}></td>
					<td id="cell46" onClick={this.selectCell}></td>
					<td id="cell47" onClick={this.selectCell}></td>
				</tr>
				<tr id="row7">
					<td id="cell48" onClick={this.selectCell}></td>
					<td id="cell49" onClick={this.selectCell}></td>
					<td id="cell50" onClick={this.selectCell}></td>
					<td id="cell51" onClick={this.selectCell}></td>
					<td id="cell52" onClick={this.selectCell}></td>
					<td id="cell53" onClick={this.selectCell}></td>
					<td id="cell54" onClick={this.selectCell}></td>
					<td id="cell55" onClick={this.selectCell}></td>
				</tr>
				<tr id="row8">
					<td id="cell56" onClick={this.selectCell}></td>
					<td id="cell57" onClick={this.selectCell}></td>
					<td id="cell58" onClick={this.selectCell}></td>
					<td id="cell59" onClick={this.selectCell}></td>
					<td id="cell60" onClick={this.selectCell}></td>
					<td id="cell61" onClick={this.selectCell}></td>
					<td id="cell62" onClick={this.selectCell}></td>
					<td id="cell63" onClick={this.selectCell}></td>
				</tr>
				</tbody>
			</table>
		</div>
		)
	};


	render(){
		const {lobbyId} = this.props;
		return (
			<div>
			CHECKERS! - {lobbyId}
				{this.turnHTML()}
				{this.badHTML()}
			</div>

		)}
}

export default Checkers;
