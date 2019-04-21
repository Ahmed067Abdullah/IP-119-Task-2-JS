import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Button from "../../UI Components/Button/Button";

import classes from "./Header.module.css";

const header = props => {
  const { name, createdAt, path, onCopy, createRoom, logout, admin_name } = props;
  return (
    <div className={classes.header}>
      <p className={classes.room_info}>
        <span className={classes.info_val}>{name}</span>
        <span>, created at </span>
        <span className={classes.info_val}>{createdAt}</span>
        <span> by </span>
        <span className={classes.info_val}>{admin_name}</span>
      </p>

      <CopyToClipboard onCopy={onCopy} text={path}>
        <button className="btn">Get Invitation Link</button>
      </CopyToClipboard>
      <Button className="btn btn-success" clicked={createRoom}>Create Room</Button>
      <Button className="btn btn-danger" clicked={logout}>Logout</Button>
    </div>
  );
};

export default header;
