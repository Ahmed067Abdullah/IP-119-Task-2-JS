import React from "react";
import classes from "./Room.module.css";

const room = props => {
  const { name, id } = props.room;
  return (
    <div className={classes.room} onClick={() => props.setupRoom(id)}>
      {name}
    </div>
  );
};

export default room;
