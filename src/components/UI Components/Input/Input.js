import React from "react";
import classes from "./Input.module.css";

const input = props => {
  const { placeholder, changed, className, label, value, type, name } = props;
  console.log(classes);
  return (
    <div>
      <label>
        {`${label} `}
        <input
          name={name}
          className={[classes.input]}
          onChange={changed}
          placeholder={placeholder}
          value={value}
          type={type}
        />
      </label>
    </div>
  );
};

export default input;
