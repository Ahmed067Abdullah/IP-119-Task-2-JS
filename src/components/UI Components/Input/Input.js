import React from "react";
import classes from "./Input.module.css";

const input = props => {
  const { placeholder, changed, label, value, type, name } = props;
  return (
    <div className={classes.input_container}>
      <label className={classes.input_label} for={name}>{`${label} `}</label>
      <input
        id={name}
        name={name}
        className={classes.input_field}
        onChange={changed}
        placeholder={placeholder}
        value={value}
        type={type}
      />
    </div>
  );
};

export default input;
