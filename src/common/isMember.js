const isMember = (uid, members) => members.find(member => member.uid === uid);

export default isMember;