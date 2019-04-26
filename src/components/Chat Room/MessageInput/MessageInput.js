import React from "react";
import classes from "./MessageInput.module.css";
import Button from "../../UI Components/Button/Button";

const messageInput = props => {
  return (
    <div className={classes.msg_input_container}>
      <form onSubmit={props.send}>
        <input
          value={props.msg}
          onChange={props.changed}
          name="msg"
          className={classes.input_field}
          placeholder="Enter your message here..."
          autoComplete="off"
          autoFocus
        />
        <Button
          clicked={props.send}
          className={`btn btn-primary ${classes.send_btn}`}
        >
          <i className="fas fa-paper-plane" />
        </Button>
      </form>
    </div>
  );
};

export default messageInput;
