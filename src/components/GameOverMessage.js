import React from "react";
import "./css/Modal.css";

const gameOverMessage = props => {
  const { handleClose, show } = props;
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <h1>Game Over </h1>
	      {props.isWinner}<br/>
        <button onClick={handleClose}>Go to dashboard</button>
      </section>
    </div>
  );
};

export default gameOverMessage;
