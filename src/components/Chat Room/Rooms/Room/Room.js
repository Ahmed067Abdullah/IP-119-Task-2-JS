import React from "react";

const room = props => {
  const { name } = props.room;
  return <div>{name}</div>;
};

export default room;
