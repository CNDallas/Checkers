import React, {Component} from 'react'
import {USER_VERIFY} from '../api/Events'

class Login extends Component {
	setLogin = ({name, isPlayer}) => {
		if (isPlayer) {
			this.setError("User Name is Unavailable")
		} else {
			this.setError()
			this.props.setLogin(name)
		}
	}
	handleSubmit = (e) => {
		console.log("HI")
		const {socket} = this.props
		const {name} = this.state
		socket.emit(USER_VERIFY, name, this.setUser)
	}
	handleChange = (e) => {
		this.setState({name: e.target.value})
	}
	setError = (error) => {
		this.setState({error})
	}

	constructor(props, context) {
		super(props, context);
		this.state = {
			name: "",
			error: ""
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	render() {
		const {name, error} = this.state
		return (
			<div className="login">
				<form onSubmit={this.handleSubmit} className="login-form">
					<label htmlFor="name">
						<h2>Enter your username {+'this.props.socket.id'}</h2>
					</label>
					<input
						type="text"
						value={name}
						onChange={this.handleChange}
						placeholder={'Enter your desired name '}
					/> <input type="submit" value="Submit"/>
				</form>
				<div className="error">{error ? error : null}</div>
			</div>
		);
	}
}

export default Login;
