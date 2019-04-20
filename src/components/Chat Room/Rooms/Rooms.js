import React from "react";
import Room from "./Room/Room";

const rooms = props => {
  const rooms = props.rooms.map(room => <Room key={room.id} room={room} />);
  return (
    <div>
      <h1>Rooms</h1>
      {rooms}
    </div>
  );
};

export default rooms;
