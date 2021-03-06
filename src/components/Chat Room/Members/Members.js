import React from "react";
import Member from "./Member/Member";

// stylesheet
import classes from "./Members.module.css";

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
        uid={props.uid}
      />
    ));
  }

  return (
    <div className={classes.members_container}>
      <h1 className={classes.heading}>Members</h1>
      {members}
    </div>
  );
};

export default members;
