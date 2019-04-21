import React from "react";
import { Link } from 'react-router-dom';

const room = props => {
  const { name,id } = props.room;
  return  <div onClick={() => props.setupRoom(id)}>{name}</div>;
};

export default room;
