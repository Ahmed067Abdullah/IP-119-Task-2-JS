import dispatcher from "../dispater";
import { database } from "firebase";
import * as actionTypes from "./actionTypes";

export const getRoom = rid => dispatch => {
  dispatch(dispatcher(actionTypes.START_LOADING));
  console.log("fetching for",rid);
  database()
    .ref(`/rooms/${rid}`)
    .on("value", snapshot => {
      const room = snapshot.val();
      console.log("fetched", room);
      dispatch(dispatcher(actionTypes.SET_ROOM, room));
      dispatch(dispatcher(actionTypes.STOP_LOADING));
    });
};

export const getRoomsList = uid => dispatch => {
  dispatch(dispatcher(actionTypes.START_LOADING));
  console.log("fetching rooms for",uid);
  database()
    .ref("/rooms/")
    .on("value", snapshot => {
      const room = snapshot.val();
      console.log("fetched", room);
      // dispatch(dispatcher(actionTypes.SET_ROOM, room));
      dispatch(dispatcher(actionTypes.STOP_LOADING));
    });
};

export const sendMessage = payload => dispatch => {
  console.log("sending",payload);
}

export const removeMember = payload => dispatch => {
  console.log("removing",payload);
}