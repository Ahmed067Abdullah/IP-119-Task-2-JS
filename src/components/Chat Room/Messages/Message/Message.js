import React from "react";

const message = props => {
  const { posted_by, text } = props.message;
  return <div>{`${posted_by} : ${text}`}</div>;
};

export default message;
