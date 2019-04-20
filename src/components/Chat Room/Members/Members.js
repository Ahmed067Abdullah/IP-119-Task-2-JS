import React from "react";
import Member from "./Member/Member";

const members = props => {
  const members = props.members.map(member => (
    <Member key={member.uid} member={member} />
  ));
  return (
    <div>
      <h1>Members</h1>
      {members}
    </div>
  );
};

export default members;
