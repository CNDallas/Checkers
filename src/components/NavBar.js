import React from 'react'
import "tachyons"
import "./css/NavBar.css"

const navBar = (props) =>  {

	let navBarArray = props.linkItems.map(nav =>
		(
		<button onClick={nav.func} key={nav.key} className="create shadow-1">{nav.text}</button>
		));

	return (
		<div>
			{navBarArray}
		</div>
	);
};

export default navBar;
