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
      for (let key in roomsObj){
        if(true){
          rooms.push({ id: key, ...roomsObj[key] });
        }
      }

      dispatch(dispatcher(actionTypes.SET_ROOMS_LIST, rooms));
      dispatch(dispatcher(actionTypes.STOP_LOADING));
    });
};

export const sendMessage = payload => dispatch => {
  console.log("sending", payload);
};

export const removeMember = payload => dispatch => {
  console.log("removing", payload);
};
