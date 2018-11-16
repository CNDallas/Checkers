import React, {Component} from 'react'
import 'tachyons'
import "./css/Checkers.css"

class Checkers extends Component {
	constructor(props, context) {
		super(props, context);

	}
	//PUT METHOD/FUNCTIONS HERE

	render(){
		const {lobbyId} = this.props
		return (
		<h1>CHECKERS! - {lobbyId}</h1>

		//PUT WHAT TO BE DISPLAYED HERE
		)}
}



export default Checkers;
