import React from "react";
import classes from "./Room.module.css";

const room = props => {
  const { name, id } = props.room;
  const current = props.currentRoom === id ? classes.current_room : "";
  
  return (
    <div className={`${classes.room} ${current}`} onClick={() => props.setupRoom(id)}>
      {name}
    </div>
  );
};

export default room;
