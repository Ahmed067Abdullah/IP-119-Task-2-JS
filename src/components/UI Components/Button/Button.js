import React from "react";
import classes from './Button.module.css';

const button = props => {
  const { children, clicked } = props;
  return (
    <button className={classes.btn} onClick={clicked}>
      {children}
    </button>
  );
};

export default button;
