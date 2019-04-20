import dispatcher from "../dispater";
import { database } from "firebase";
import * as actionTypes from "./actionTypes";

export const getRoom = rid => dispatch => {
  dispatch(dispatcher(actionTypes.START_LOADING));
  console.log("fetching for", rid);
  database()
    .ref(`/rooms/${rid}`)
    .on("value", snapshot => {
      const roomData = snapshot.val();
      console.log("fetched", roomData);

      const members = [];
      for (let key in roomData.members)
        members.push({ id: key, ...roomData.members[key] });

      const messages = [];
      for (let key in roomData.messages)
        messages.push({ id: key, ...roomData.messages[key] });

      const room = {
        rid,
        created_at: roomData.created_at,
        invite_code: roomData.invite_code,
        name: roomData.name
      };
      const payload = { room, members, messages };

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
  console.log("sent");
};

export const createRoom = payload => dispatch => {
  console.log("creating room");
  database()
    .ref("/rooms")
    .push({
      admin: payload.uid,
      members: ["USER DETAILS HERE"]
    });
};

export const removeMember = payload => dispatch => {
  console.log("removing", payload);
};
