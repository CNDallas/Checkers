import React from 'react'
import "./css/Modal.css"

const stats = (props) => {
	const { handleClose, show} = props;
	const showHideClassName = show ? "modal display-block" : "modal display-none";

	return (
		<div className={showHideClassName}>
			<section className="modal-main">
				<h1>STATS</h1>
				<button onClick={handleClose}>close</button>
			</section>
		</div>
	);
};

export default stats
