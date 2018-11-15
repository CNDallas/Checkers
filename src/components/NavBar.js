import React, {Component} from 'react'
import "tachyons"
import "./css/NavBar.css"

class NavBar extends Component {


	render() {
		return (
			<div>

					<button onClick={this.props.creategame} className="create shadow-1">Create Game</button>
					<button onClick={this.props.refreshlobby} className="create shadow-1">Refresh Games</button>
					<button onClick={this.props.viewstats} className="create shadow-1">View Stats</button>
					<button onClick={this.props.logout} className="create shadow-1">Logout</button>


			</div>
		)
	}
}

export default NavBar;
