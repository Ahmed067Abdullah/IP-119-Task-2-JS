import React from "react";
import Message from "./Message/Message";

const messages = props => {
  const messages = props.messages.map(message => (
    <Message key={message.id} message={message} />
  ));
  return (
    <div>
      <h1>Messages</h1>
      {messages}
    </div>
  );
};

export default messages;
