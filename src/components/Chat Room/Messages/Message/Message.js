import React from "react";
import classes from "./Message.module.css";

const message = props => {
  const { posted_by, text, uid } = props.message;
  const sentByMy = uid === props.uid;
  let sender = "";
  let msgClass = classes.own;
  let abc = classes.own_msg;
  if (!sentByMy) {
    sender = posted_by;
    msgClass = classes.others;
    abc = "";
  }
  return (
    <div className={classes.message_container}>
      <div className={msgClass}>
        <p className={classes.sender}>{sender}</p>
        <p className={`${classes.message_text} ${abc}`}>{text}</p>
      </div>
    </div>
  );
};

export default message;
