import React, {Component} from 'react'
import {RECEIVE_MESSAGE, SEND_MESSAGE} from '../api/Events';
import 'tachyons'
import "./css/Checkers.css"

class Checkers extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			sendMessage: "Send Message",
			recMessage: "No current Message"
		};
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
		};
	};

	render(){
		const {sendMessage, recMessage} = this.state;
		const {lobbyId} = this.props;
		return (
			<div>
		<h1 className = 'white'>CHECKERS! - {lobbyId}</h1>
		<input type='text' onKeyDown={this.keyPressHandler} onChange={this.onChangeHandler} value={sendMessage}/>
				<p className = 'white'>{recMessage}</p>
			</div>
		//PUT WHAT TO BE DISPLAYED HERE
		)}
}

export default Checkers;
