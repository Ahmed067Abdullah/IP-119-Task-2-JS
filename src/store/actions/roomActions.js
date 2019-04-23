import dispatcher from "../dispater";
import { database } from "firebase";
import * as actionTypes from "./actionTypes";

export const getRoom = rid => (dispatch, getState) => {
  dispatch(dispatcher(actionTypes.START_LOADING));
  console.log("fetching for", rid);
  let oldMembers = [];
  let flag = false;
  const loggedInUser = getState().auth.uid;
  database()
    .ref(`/rooms/${rid}`)
    .on("value", snapshot => {
      oldMembers = getState().room.members;
      console.log("before::Members:", oldMembers);
      const roomData = snapshot.val();
      let payload = {};
      console.log("fetched", roomData);

      if (roomData) {
        const { admin, admin_name, created_at, name } = roomData;
        const members = [];
        for (let key in roomData.members)
          members.push({ id: key, ...roomData.members[key] });

        const messages = [];
        for (let key in roomData.messages)
          messages.push({ id: key, ...roomData.messages[key] });

        const room = { rid, admin, admin_name, created_at, name };

        payload = { room, members, messages };

        if (flag && oldMembers.length < members.length) {
          for (let i = 0; i < members.length; i++) {
            const member = members[i];
            if (
              !oldMembers.find(
                oldMember =>
                  oldMember.uid === member.uid && member.uid !== loggedInUser
              )
            ) {
              alert(`${member.name} just joined the room`);
            }
          }
        }

        oldMembers = [...members];
        flag = true;
      }
      console.log("after::Members:", oldMembers);
      dispatch(dispatcher(actionTypes.SET_ROOM, payload));
      dispatch(dispatcher(actionTypes.STOP_LOADING));
    });
};

export const getRoomsList = uid => dispatch => {
  dispatch(dispatcher(actionTypes.START_LOADING));
  console.log("fetching rooms for", uid);

  database()
    .ref("/rooms/")
    .on("value", snapshot => {
      const roomsObj = snapshot.val();
      console.log("fetched", roomsObj);

      const rooms = [];
      for (let key in roomsObj) {
        const members = roomsObj[key].members;
        for (let member in members) {
          if (members[member].uid === uid) {
            rooms.push({ id: key, name: roomsObj[key].name });
            break;
          }
        }
      }

      dispatch(dispatcher(actionTypes.SET_ROOMS_LIST, rooms));
      dispatch(dispatcher(actionTypes.STOP_LOADING));
    });
};

export const sendMessage = payload => dispatch => {
  const { room, text, uid, posted_by } = payload;

  database()
    .ref(`rooms/${room}/messages`)
    .push({
      text,
      uid,
      posted_by,
      posted_at: Date.now()
    });
  console.log("sent", payload);
};

export const createRoom = payload => async dispatch => {
  console.log("creating room");
  const { name, uid, uname } = payload;
  const ref = await database()
    .ref("/rooms")
    .push({
      admin: uid,
      created_at: Date.now(),
      name,
      admin_name: uname
    }).key;

  await database()
    .ref(`rooms/${ref}/members`)
    .push({ name: uname, uid });
};

export const addMember = payload => async dispatch => {
  // const {rid} = payload;
  const { name, uid, rid } = payload;
  const res = await database()
    .ref(`rooms/${rid}`)
    .once("value");
  const members = res.val().members;
  let newMem = true;
  if (members) {
    for (let id in members) {
      if (members[id].uid === uid) {
        newMem = false;
        break;
      }
    }
  }
  if (newMem) {
    database()
      .ref(`rooms/${rid}/members`)
      .push({
        name,
        uid
      });
  }
  console.log("new member:", newMem);
};

export const removeMember = payload => dispatch => {
  console.log("removing", payload);
  database()
    .ref(`/rooms/${payload.rid}/members/${payload.id}`)
    .remove();
};
