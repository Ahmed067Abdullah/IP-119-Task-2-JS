import React from "react";
import Room from "./Room/Room";

const rooms = props => {
  let rooms = "No Rooms to show";
  if (props.rooms && props.rooms.length > 0) {
    rooms = props.rooms.map(room => (
      <Room key={room.id} room={room} setupRoom={props.setupRoom} />
    ));
  }

  return (
    <div>
      <h1>Rooms</h1>
      {rooms}
    </div>
  );
};

export default rooms;
