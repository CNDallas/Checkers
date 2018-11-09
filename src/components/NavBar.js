import React, {Component} from 'react'
import "tachyons"

class NavBar extends Component {


	render() {
		return (
			<div>

				<a href="game.html"><button onClick={this.props.createGame} className="create grow shadow-1">Create Game</button></a>

			</div>
		)
	}
}

export default NavBar;