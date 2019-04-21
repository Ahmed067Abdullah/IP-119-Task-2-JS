import React from "react";
import classes from "./Member.module.css";

const member = props => {
  const { name, uid, id } = props.member;

  return (
    <div className={classes.member}>
      {name}
      {uid === props.admin || !props.canRemove ? (
        ""
      ) : (
        <i
          className={`fas fa-times ${classes.remove}`}
          onClick={() => props.onRemoveMember(id)}
        />
      )}
    </div>
  );
};

export default member;
