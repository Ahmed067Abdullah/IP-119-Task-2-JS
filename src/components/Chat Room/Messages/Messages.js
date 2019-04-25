import React from "react";
import Message from "./Message/Message";

// stylesheet
import classes from "./Messages.module.css";

const messages = props => {
  let messages = "No messages to show";

  if (props.messages && props.messages.length > 0) {
    messages = props.messages.map(message => (
      <Message
        key={message.id}
        message={message}
        uid={props.uid}
        messageClicked={props.messageClicked}
      />
    ));
  }
  return (
    <div className={classes.messages_container} ref={el => props.setEl(el)}>
      {messages}
    </div>
  );
};

export default messages;
