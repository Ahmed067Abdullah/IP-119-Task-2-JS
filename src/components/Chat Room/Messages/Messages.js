import React from "react";
import Message from "./Message/Message";

const messages = props => {
  let messages = "No messages to show";

  if (props.messages && props.messages.length > 0) {
    messages = props.messages.map(message => (
      <Message key={message.id} message={message} uid={props.uid} />
    ));
  }
  return <div>{messages}</div>;
};

export default messages;
