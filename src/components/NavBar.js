import React from 'react'
import "tachyons"
import "./css/NavBar.css"

const navBar = (props) =>  {
	return (
		<div>
			<button onClick={props.creategame} className="create shadow-1">Create Game</button>
			<button onClick={props.refreshlobby} className="create shadow-1">Refresh Games</button>
			<button onClick={props.viewstats} className="create shadow-1">View Stats</button>
			<button onClick={props.logout} className="create shadow-1">Logout</button>
		</div>
	);
};

export default navBar;
