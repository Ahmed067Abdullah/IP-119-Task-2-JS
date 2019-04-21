import React from "react";

const member = props => {
  const { name, uid,id } = props.member;
  return (
    <div>
      {name}
      {uid === props.admin || !props.canRemove ? (
        ""
      ) : (
        <i className="fas fa-times" onClick={() => props.onRemoveMember(id)} />
      )}
    </div>
  );
};

export default member;
