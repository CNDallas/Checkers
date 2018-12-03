import React from "react";
import "./css/Modal.css";

const fullMessage = props => {
  const { handleClose, show } = props;
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <h1>{props.username}</h1>
        {props.message} <br />
        <button onClick={handleClose}>close</button>
      </section>
    </div>
  );
};

export default fullMessage;
