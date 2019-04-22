import React from "react";
import Room from "./Room/Room";
import classes from "./Rooms.module.css";

const rooms = props => {
  let rooms = "No Rooms to show";
  if (props.rooms && props.rooms.length > 0) {
    rooms = props.rooms.map(room => (
      <Room
        key={room.id}
        room={room}
        setupRoom={props.setupRoom}
        currentRoom={props.cur}
      />
    ));
  }

  return (
    <div className={classes.rooms_container}>
      <h1 className={classes.heading}>Rooms</h1>
      {rooms}
    </div>
  );
};

export default rooms;
