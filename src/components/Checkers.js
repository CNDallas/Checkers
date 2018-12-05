import React, {Component} from 'react'
import "./css/Checkers.css"
import uuidv4 from "uuid/v4";
import NavBar from "./NavBar";
import * as checkers_client from "./checkers_client.js";
import GameOverMessage from "./GameOverMessage" //Leaving out as it throws a bunch of errors atm
const {MAKE_MOVE, RECEIVE_MOVE, USER_WONR, USER_JOINED_HOSTS_GAME, USER_LOSER} = require('../api/Events');

class Checkers extends Component {
	constructor(props, context) {
		super(props, context);
		this.navigationBarUpdater();
	};
	state = {
		side: "none",
		isGameOver: false,
		isWinnerMessage: ""
	}
	componentDidMount() {
			checkers_client.onCreate();
			this.timerID = setInterval(() => {
				this.tick()
			}, 1000
		);
	};
	tick() {
		const {socket} = this.props;
		socket.on(USER_JOINED_HOSTS_GAME,() => {
		this.setState({"side":"blue"});
		});
		//console.log(this.state);
		socket.on(RECEIVE_MOVE,( fromX, fromY, toX,toY) => {
			var tarFrom=document.getElementById("cell"+(fromY*8+fromX));
			var tarTo=document.getElementById("cell"+(toY*8+toX));
			checkers_client.process_move(tarFrom,tarTo,socket);
			if(this.state.side==="none")
			{
				this.setState({"side":"red"});
			}
		//	return;
		});
		socket.on(USER_WONR, () => {
			const isWinnerMessage = "Congratz You Won!";
			const isGameOver = true;
			this.setState({isGameOver,isWinnerMessage})
		})
		socket.on(USER_LOSER, () => {
			const isWinnerMessage = "You Lost - Better Luck Next Time";
			const isGameOver = true;
			this.setState({isGameOver,isWinnerMessage})
		})

		};

	selectCell(t)
	{
		const {socket} = this.props;

		if(checkers_client.turn===0&&this.state.side!=="blue") return;
		if(checkers_client.turn===1&&this.state.side!=="red") return;
		checkers_client.selectCell(t,socket);
		//console.log('this is:', t);
	}
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
					<td id="cell0" onClick={(e)=>this.selectCell(document.getElementById("cell0"),e)}></td>
					<td id="cell1" onClick={(e)=>this.selectCell(document.getElementById("cell1"),e)}></td>
					<td id="cell2" onClick={(e)=>this.selectCell(document.getElementById("cell2"),e)}></td>
					<td id="cell3" onClick={(e)=>this.selectCell(document.getElementById("cell3"),e)}></td>
					<td id="cell4" onClick={(e)=>this.selectCell(document.getElementById("cell4"),e)}></td>
					<td id="cell5" onClick={(e)=>this.selectCell(document.getElementById("cell5"),e)}></td>
					<td id="cell6" onClick={(e)=>this.selectCell(document.getElementById("cell6"),e)}></td>
					<td id="cell7" onClick={(e)=>this.selectCell(document.getElementById("cell7"),e)}></td>
				</tr>
				<tr id="row2">
					<td id="cell8" onClick={(e)=>this.selectCell(document.getElementById("cell8"),e)}></td>
					<td id="cell9" onClick={(e)=>this.selectCell(document.getElementById("cell9"),e)}></td>
					<td id="cell10" onClick={(e)=>this.selectCell(document.getElementById("cell10"),e)}></td>
					<td id="cell11" onClick={(e)=>this.selectCell(document.getElementById("cell11"),e)}></td>
					<td id="cell12" onClick={(e)=>this.selectCell(document.getElementById("cell12"),e)}></td>
					<td id="cell13" onClick={(e)=>this.selectCell(document.getElementById("cell13"),e)}></td>
					<td id="cell14" onClick={(e)=>this.selectCell(document.getElementById("cell14"),e)}></td>
					<td id="cell15" onClick={(e)=>this.selectCell(document.getElementById("cell15"),e)}></td>
				</tr>
				<tr id="row3">
					<td id="cell16" onClick={(e)=>this.selectCell(document.getElementById("cell16"),e)}></td>
					<td id="cell17" onClick={(e)=>this.selectCell(document.getElementById("cell17"),e)}></td>
					<td id="cell18" onClick={(e)=>this.selectCell(document.getElementById("cell18"),e)}></td>
					<td id="cell19" onClick={(e)=>this.selectCell(document.getElementById("cell19"),e)}></td>
					<td id="cell20" onClick={(e)=>this.selectCell(document.getElementById("cell20"),e)}></td>
					<td id="cell21" onClick={(e)=>this.selectCell(document.getElementById("cell21"),e)}></td>
					<td id="cell22" onClick={(e)=>this.selectCell(document.getElementById("cell22"),e)}></td>
					<td id="cell23" onClick={(e)=>this.selectCell(document.getElementById("cell23"),e)}></td>
				</tr>
				<tr id="row4">
					<td id="cell24" onClick={(e)=>this.selectCell(document.getElementById("cell24"),e)}></td>
					<td id="cell25" onClick={(e)=>this.selectCell(document.getElementById("cell25"),e)}></td>
					<td id="cell26" onClick={(e)=>this.selectCell(document.getElementById("cell26"),e)}></td>
					<td id="cell27" onClick={(e)=>this.selectCell(document.getElementById("cell27"),e)}></td>
					<td id="cell28" onClick={(e)=>this.selectCell(document.getElementById("cell28"),e)}></td>
					<td id="cell29" onClick={(e)=>this.selectCell(document.getElementById("cell29"),e)}></td>
					<td id="cell30" onClick={(e)=>this.selectCell(document.getElementById("cell30"),e)}></td>
					<td id="cell31" onClick={(e)=>this.selectCell(document.getElementById("cell31"),e)}></td>
				</tr>
				<tr id="row5">
					<td id="cell32" onClick={(e)=>this.selectCell(document.getElementById("cell32"),e)}></td>
					<td id="cell33" onClick={(e)=>this.selectCell(document.getElementById("cell33"),e)}></td>
					<td id="cell34" onClick={(e)=>this.selectCell(document.getElementById("cell34"),e)}></td>
					<td id="cell35" onClick={(e)=>this.selectCell(document.getElementById("cell35"),e)}></td>
					<td id="cell36" onClick={(e)=>this.selectCell(document.getElementById("cell36"),e)}></td>
					<td id="cell37" onClick={(e)=>this.selectCell(document.getElementById("cell37"),e)}></td>
					<td id="cell38" onClick={(e)=>this.selectCell(document.getElementById("cell38"),e)}></td>
					<td id="cell39" onClick={(e)=>this.selectCell(document.getElementById("cell39"),e)}></td>
				</tr>
				<tr id="row6">
					<td id="cell40" onClick={(e)=>this.selectCell(document.getElementById("cell40"),e)}></td>
					<td id="cell41" onClick={(e)=>this.selectCell(document.getElementById("cell41"),e)}></td>
					<td id="cell42" onClick={(e)=>this.selectCell(document.getElementById("cell42"),e)}></td>
					<td id="cell43" onClick={(e)=>this.selectCell(document.getElementById("cell43"),e)}></td>
					<td id="cell44" onClick={(e)=>this.selectCell(document.getElementById("cell44"),e)}></td>
					<td id="cell45" onClick={(e)=>this.selectCell(document.getElementById("cell45"),e)}></td>
					<td id="cell46" onClick={(e)=>this.selectCell(document.getElementById("cell46"),e)}></td>
					<td id="cell47" onClick={(e)=>this.selectCell(document.getElementById("cell47"),e)}></td>
				</tr>
				<tr id="row7">
					<td id="cell48" onClick={(e)=>this.selectCell(document.getElementById("cell48"),e)}></td>
					<td id="cell49" onClick={(e)=>this.selectCell(document.getElementById("cell49"),e)}></td>
					<td id="cell50" onClick={(e)=>this.selectCell(document.getElementById("cell50"),e)}></td>
					<td id="cell51" onClick={(e)=>this.selectCell(document.getElementById("cell51"),e)}></td>
					<td id="cell52" onClick={(e)=>this.selectCell(document.getElementById("cell52"),e)}></td>
					<td id="cell53" onClick={(e)=>this.selectCell(document.getElementById("cell53"),e)}></td>
					<td id="cell54" onClick={(e)=>this.selectCell(document.getElementById("cell54"),e)}></td>
					<td id="cell55" onClick={(e)=>this.selectCell(document.getElementById("cell55"),e)}></td>
				</tr>
				<tr id="row8">
					<td id="cell56" onClick={(e)=>this.selectCell(document.getElementById("cell56"),e)}></td>
					<td id="cell57" onClick={(e)=>this.selectCell(document.getElementById("cell57"),e)}></td>
					<td id="cell58" onClick={(e)=>this.selectCell(document.getElementById("cell58"),e)}></td>
					<td id="cell59" onClick={(e)=>this.selectCell(document.getElementById("cell59"),e)}></td>
					<td id="cell60" onClick={(e)=>this.selectCell(document.getElementById("cell60"),e)}></td>
					<td id="cell61" onClick={(e)=>this.selectCell(document.getElementById("cell61"),e)}></td>
					<td id="cell62" onClick={(e)=>this.selectCell(document.getElementById("cell62"),e)}></td>
					<td id="cell63" onClick={(e)=>this.selectCell(document.getElementById("cell63"),e)}></td>
				</tr>
				</tbody>
			</table>
		</div>
		)
	};

	closeGameOverHandler = () => {
		this.props.exitGame();
	};


	render(){
		const {lobbyId} = this.props;
		const {isGameOver, isWinnerMessage} = this.state;
		return (
			<div>
			CHECKERS! - Game ID: {lobbyId}
				<GameOverMessage
					show={isGameOver}
					handleClose={this.closeGameOverHandler}
					isWinner = {isWinnerMessage}
				/>
				{this.turnHTML()}
				{this.badHTML()}
			</div>

		)}
}

export default Checkers;
