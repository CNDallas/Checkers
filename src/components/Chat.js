import React, {Component} from 'react'
import {RECEIVE_MESSAGE, SEND_MESSAGE} from '../api/Events';
import "./css/Chat.css";
import FullMessage from "./FullMessage"

class Chat extends Component {
	componentDidMount() {
		this.timerID = setInterval(() => {
				this.tick()
			}, 1000
		);
		this.scrollToBottom();
	};

	componentDidUpdate() {
		this.scrollToBottom();
	};

	componentWillUnmount() {
		clearInterval(this.timerID);
	};


	state = {
		recMessage: "No current Message",
		isChatOpen: true,
		chatMessages: [],
		showFullMessage: null
	}

	toggleChatHandler = () => {
		console.log("chat is changing: " + !this.state.isChatOpen)
		this.setState({"isChatOpen": !this.state.isChatOpen});
	};

	tick() {
		this.messageReceiver();
		if (this.props.pmUsername){
			console.log("PMING")
			this.setState({sendMessage: this.props.pmUsername})
		}
	};

	sendMessage = (value) => {
		const {socket} = this.props;
		const message = value;
		console.log("Sending Message: " + message);
		socket.emit(SEND_MESSAGE, message, (userMessage) => {
			console.log("return message id: " + userMessage.id);
			if (this.state.chatMessages.filter(e => e.id === userMessage.id).length === 0) {
				const chatMessages = [...this.state.chatMessages];
				chatMessages.push(userMessage);
				this.setState({chatMessages});
			}
		});

		this.props.displayMessage("");
	};

	messageReceiver = () => {
		const {socket} = this.props;
		socket.on(RECEIVE_MESSAGE, (recMessage) => {
			if (this.state.chatMessages.filter(e => e.id === recMessage.id).length === 0) {
				console.log("Message Rec: " + recMessage.message);
				const chatMessages = [...this.state.chatMessages];
				chatMessages.push(recMessage);
				this.setState({chatMessages});
			}
		});
	};

	keyPressHandler = (event) => {
		console.log("KeyPressed");
		if (event.keyCode === 13) {
			const message = event.target.value;
			console.log("Message being sent: " + message);
			this.sendMessage(message);
		}
	};

	scrollToBottom = () => {
		if(this.state.isChatOpen) {
			this.lastMessage.scrollIntoView({behavior: "smooth"});
		}
	}

	userNameOnClickHandler = (userName) => {
		const split = userName.split(" ");
		const username = split[split.length - 1];
		if (username !== "SYSTEM") {
			this.props.displayMessage("/w " + username + " ");
		}
	}

	messageOnClickHandler = (userName,message) => {
		const output = <FullMessage show={true} handleClose={this.closeMessageBoxHandler} message= {message} username = {userName}/>
		this.setState({showFullMessage: output})
	}

	closeMessageBoxHandler = () => {
		this.setState({showFullMessage: null})
	}



	render() {
		const {isChatOpen, chatMessages, showFullMessage} = this.state;
		let chat = chatMessages.map(m => (
			<li key={m.id} style={{color:m.color}} className="chat-line">
				<span className="chat-username" onClick={this.userNameOnClickHandler.bind(this,m.userName)}>{m.userName}</span>
				<span className="chat-message" onClick={this.messageOnClickHandler.bind(this,m.userName,m.message)}>{m.message}</span>
			</li>
		));

		return (
			<React.Fragment>
				{showFullMessage}
				{isChatOpen ?
					<div className="chat-open">
						<div className="chat-header">
						<span className="btn-close" onClick={this.toggleChatHandler}>X</span>
						Chat
						</div>
						<ul>{chat}</ul>
						<input type="text" className="chat-box" onChange={this.props.onChange}
						       onKeyDown={this.keyPressHandler}  onClick={this.props.onClick} value={this.props.message}/>
						<div style={ {float:"left", clear: "both" }} ref={(el) => { this.lastMessage = el; }}>
						</div>
					</div>
					:
					<button className="toggle-chat" onClick={this.toggleChatHandler}>Chat</button>

				}
			</React.Fragment>
		)

	}
}

export default Chat
