import React, {Component} from 'react'
import {RECEIVE_MESSAGE, SEND_MESSAGE} from '../api/Events';
import 'tachyons'
import "./css/Checkers.css"
import "./css/Chat.css";

class Chat extends Component {

	componentDidMount() {
		this.timerID = setInterval(() => {
				this.tick()
			}, 1000
		);
	};

	componentWillUnmount() {
		clearInterval(this.timerID);
	};


	state = {
		sendMessage: "Send Message",
		recMessage: "No current Message",
		isChatOpen: true,
		chatMessages: []
	}

	toggleChatHandler = () => {
		console.log("chat is changing: " + !this.state.isChatOpen)
		this.setState({"isChatOpen": !this.state.isChatOpen});
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
			if (this.state.chatMessages.filter(e => e.id === recMessage.id).length === 0) {
				console.log("Message Rec: " + recMessage.message);
				const chatMessages = [...this.state.chatMessages];
				chatMessages.push(recMessage)
				this.setState({chatMessages});
			}
		});
	};

	onChangeHandler = (event) => {
		const sendMessage = event.target.value;
		this.setState({sendMessage});
	};

	keyPressHandler = (event) => {
		console.log("KeyPressed");
		if (event.keyCode === 13) {
			const message = event.target.value;
			console.log("Message being sent: " + message);
			this.sendMessage(message);
		}
	};

	render() {
		const {isChatOpen, sendMessage, chatMessages} = this.state;
		let chat = chatMessages.map(m => (
			<li key={m.id} className="chat-line"><span className="chat-username">{m.userName}</span><span className="chat-message">{m.message}</span></li>
		));

		return (
			<React.Fragment>
				{isChatOpen ?
					<div className="chat-open">
						<div className="chat-header">
						<span className="btn-close" onClick={this.toggleChatHandler}>X</span>
						Chat
						</div>
						<ul>{chat}</ul>
						<input type="text" className="chat-box" onChange={this.onChangeHandler}
						       onKeyDown={this.keyPressHandler} value={sendMessage}/>
					</div>
					:
					<button className="toggle-chat" onClick={this.toggleChatHandler}>Chat</button>
				}
			</React.Fragment>
		)

	}
}

export default Chat
