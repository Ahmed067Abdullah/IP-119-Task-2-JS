import React from "react";
import Member from "./Member/Member";

const members = props => {
  let members = "No members to show";
  if (props.members && props.members.length > 0) {
    members = props.members.map(member => (
      <Member
        key={member.uid}
        member={member}
        admin={props.admin}
        onRemoveMember={props.onRemoveMember}
        canRemove={props.canRemove}
      />
    ));
  }

  return (
    <div>
      <h1>Members</h1>
      {members}
    </div>
  );
};

export default members;
