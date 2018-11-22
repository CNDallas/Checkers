import React, {Component} from 'react'
import {RECEIVE_MESSAGE, SEND_MESSAGE} from '../api/Events';
import 'tachyons'
import "./css/Checkers.css"
import uuidv4 from "uuid/v4";
import NavBar from "./NavBar";

class Checkers extends Component {
	constructor(props, context) {
		super(props, context);
		this.navigationBarUpdater();
		this.state = {
			sendMessage: "Send Message",
			recMessage: "No current Message"
		};
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

	componentDidMount() {
		this.timerID = setInterval(() => {
				this.tick()
			},100
		);
	};

	componentWillUnmount() {
		clearInterval(this.timerID);
	};

	tick() {
		this.messageReceiver();
	};

	sendMessage = (value) => {
		const {socket} = this.props;
		const message = value;
		console.log("Sending Message: " + message);
		socket.emit(SEND_MESSAGE, message);
		const sendMessage = "Message Sent";
		this.setState({sendMessage});
	};

	messageReceiver = () => {
		const {socket} = this.props;
		socket.on(RECEIVE_MESSAGE, (recMessage) => {
			console.log("Message Rec: " + recMessage);
			this.setState({recMessage});
		});
	};

	onChangeHandler = (event) => {
		const sendMessage = event.target.value;
		this.setState({sendMessage});
	};

	keyPressHandler = (event) => {
		console.log("KeyPressed");
		if(event.keyCode === 13){
			const message = event.target.value;
			console.log("Message being sent: "+ message);
			this.sendMessage(message);
		}
	};

	render(){
		const {sendMessage, recMessage} = this.state;
		const {lobbyId} = this.props;
		return (
			<div>
		CHECKERS! - {lobbyId}
				<br /><input type='text' onKeyDown={this.keyPressHandler} onChange={this.onChangeHandler} value={sendMessage}/>
				<br />{recMessage}
			</div>

		)}
}

export default Checkers;
