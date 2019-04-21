import React from "react";

const button = props => {
  const { children, clicked, className } = props;
  return (
    <button className={className} onClick={clicked}>
      {children}
    </button>
  );
};

export default button;
