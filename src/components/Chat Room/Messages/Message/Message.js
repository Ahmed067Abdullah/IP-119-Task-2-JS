import React from "react";
import classes from "./Message.module.css";

const getTimeString = time => new Date(time).toString().slice(0, 24);

const message = props => {
  const { posted_by, text, uid, posted_at, clicked, id } = props.message;
  const sentByMy = uid === props.uid;
  let sender = "";
  let msgClass = classes.own;
  let abc = classes.own_msg;
  if (!sentByMy) {
    sender = posted_by;
    msgClass = classes.others;
    abc = "";
  }

  const show = clicked ? classes.show : "";
  return (
    <div className={classes.message_container}>
      <div className={msgClass}>
        <p className={classes.sender}>{sender}</p>
        <p
          className={`${classes.text} ${abc}`}
          onClick={() => props.messageClicked(id)}
        >
          {text}
        </p>
        <p className={`${classes.time} ${show}`}>{getTimeString(posted_at)}</p>
      </div>
    </div>
  );
};

export default message;
