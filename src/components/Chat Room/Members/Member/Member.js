import React from "react";
import classes from "./Member.module.css";

const member = props => {
  const { name, uid, id } = props.member;
  const own = uid === props.uid ? classes.own : "";

  return (
    <div className={`${classes.member} ${own}`}>
      {name}
      {uid === props.admin || !props.canRemove ? (
        ""
      ) : (
        <i
          className={`fas fa-times ${classes.remove}`}
          onClick={() => props.onRemoveMember(id)}
        >
          <span className={classes.tooltiptext}>Remove</span>
        </i>
      )}
    </div>
  );
};

export default member;
