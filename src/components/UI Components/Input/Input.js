import React from "react";
import classes from "./Input.module.css";

const input = props => {
  const { placeholder, changed, className, label } = props;
  console.log(classes);
  return (
    <div>
      <label>
        {`${label} `}
        <input
          className={[classes.input]}
          onChange={changed}
          placeholder={placeholder}
        />
      </label>
    </div>
  );
};

export default input;
