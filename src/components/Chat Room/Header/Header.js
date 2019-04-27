import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

// UI Components
import Button from "../../UI Components/Button/Button";

// stylesheet
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
        <button className={`btn btn-warning ${classes.invite}`}>Get Invitation Link</button>
      </CopyToClipboard>
      <Button className={`btn btn-success ${classes.btn1}`} clicked={createRoom}>
        <i className={`fas fa-plus-circle ${classes.icon}`}></i>
        <span className={classes.tooltiptext}>Create new room</span>
      </Button>
      <Button className={`btn btn-danger ${classes.btn2}`} clicked={logout}>
        <i className={`fas fa-sign-out-alt ${classes.icon}`}></i>
        <span className={classes.tooltiptext}>Sign out</span>
      </Button>
    </div>
  );
};

export default header;
