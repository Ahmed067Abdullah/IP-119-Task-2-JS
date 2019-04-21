import React from "react";

const message = props => {
  const { posted_by, text, uid } = props.message;
  return <div className={uid === props.uid ? "own" : "agla"}>{`${posted_by} : ${text}`}</div>;
};

export default message;
