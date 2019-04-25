import dispatcher from "../dispater";
import { database } from "firebase";
import * as actionTypes from "./actionTypes";
import isMember from "../../common/isMember";

// to store DB references
let usersRef;
let roomRef;

export const createRoom = payload => async dispatch => {
  console.log("creating room");
  const { name, uid, uname, history, setupRoom } = payload;
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

  setupRoom(ref);
  history.replace(`chatbox/${ref}`);
};

export const getRoom = (rid, history) => (dispatch, getState) => {
  console.log("func called, rid:", rid);
  // start loading
  dispatch(dispatcher(actionTypes.START_LOADING));
  dispatch(dispatcher(actionTypes.SET_MEMBERS, []));
  console.log("fetching for", rid);

  let oldMembers = [];
  const loggedInUser = getState().auth.uid;

  if (usersRef) usersRef.off();
  if (roomRef) roomRef.off();

  // set current room for the loggged in user
  let updates = {};
  updates[`/users/${loggedInUser}/current_room`] = rid;
  database()
    .ref()
    .update(updates)
    .then(() => {
      // putting listener on the users node for online users
      usersRef = database()
        .ref(`/users`)
        .orderByChild("online")
        .equalTo(true);
      usersRef.on("value", onlineUsers => {
        // current members
        oldMembers = getState().room.members;

        // all online users
        onlineUsers = onlineUsers.val();
        console.log("all online", onlineUsers);

        // push online users with current room id in the array
        const members = [];
        if (onlineUsers) {
          for (let key in onlineUsers) {
            if (onlineUsers[key].current_room === rid) {
              members.push({
                id: key,
                uid: key,
                name: onlineUsers[key].name
              });
            }
          }
          console.log("online in room: ", rid, members);

          // if (
          //   !isMember(loggedInUser, members) &&
          //   isMember(loggedInUser, oldMembers)
          // ) {
          //   alert(`You're not the a member of room: ${loggedInUser} anymore`);
          //   moveToDefaultRoom(loggedInUser, history, dispatch);
          //   return;
          // }

          dispatch(dispatcher(actionTypes.SET_MEMBERS, members));

          if (
            oldMembers.length < members.length &&
            oldMembers.length !== 0 &&
            isMember(loggedInUser, members)
          ) {
            for (let i = 0; i < members.length; i++) {
              const member = members[i];
              if (
                !isMember(member.uid, oldMembers) &
                (member.uid !== loggedInUser)
              ) {
                alert(`${member.name} just joined the room`);
              }
            }
          }

          if (!isMember(loggedInUser, members) && getState().auth.uid) {
            console.log("Removed");
            moveToDefaultRoom(loggedInUser, history, dispatch);
          }
          oldMembers = [...members];
        }
      });
      roomRef = database().ref(`/rooms/${rid}`);
      roomRef.on("value", snapshot => {
        const roomData = snapshot.val();
        let payload = {};
        console.log("fetched", roomData);

        if (roomData) {
          const { admin, admin_name, created_at, name } = roomData;

          const messages = [];
          for (let key in roomData.messages)
            messages.push({
              id: key,
              ...roomData.messages[key],
              clicked: false
            });

          const room = { rid, admin, admin_name, created_at, name };

          payload = { room, messages };
        } else {
          // alert("Room Doesn't exist");
          console.log("Removed");
          moveToDefaultRoom(loggedInUser, history, dispatch);
        }
        console.log("after::Members:", oldMembers);
        dispatch(dispatcher(actionTypes.SET_ROOM, payload));
        dispatch(dispatcher(actionTypes.STOP_LOADING));
      });
    });
};

const moveToDefaultRoom = (loggedInUser, history, dispatch) => {
  console.log("moving to default room");
  history.replace(`/chatbox/${loggedInUser}`);
  dispatch(getRoom(loggedInUser, history));
  localStorage.setItem("chat-box-current-room", loggedInUser);
};

export const getRoomsList = uid => dispatch => {
  dispatch(dispatcher(actionTypes.START_LOADING));
  // console.log("fetching rooms for", uid);

  database()
    .ref("/rooms/")
    .on("value", snapshot => {
      const roomsObj = snapshot.val();
      // console.log("fetched", roomsObj);

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

/************  message actions start **********/
export const sendMessage = payload => dispatch => {
  const { room, text, uid, posted_by } = payload;

  // push new message to the messages list
  database()
    .ref(`rooms/${room}/messages`)
    .push({
      text,
      uid,
      posted_by,
      posted_at: Date.now()
    });
};

export const messageClicked = (id, msgs) => dispatch => {
  // get index of the clicked message
  const index = msgs.findIndex(msg => msg.id === id);

  // toggle clicked property of the clicked message
  msgs[index].clicked = !msgs[index].clicked;
  dispatch(dispatcher(actionTypes.SET_MESSAGES, msgs));
};
/************  message actions end **********/

/************  members actions start **********/
export const addMember = payload => async dispatch => {
  const { uid, rid } = payload;
  const memberRef = database().ref(`rooms/${rid}/members/${uid}`);

  // try to get this user from members list of the room
  const res = await memberRef.once("value");

  // if not found then add to the members list
  if (!res.val()) memberRef.set({ uid });
};

export const removeMember = payload => dispatch => {
  console.log("removing", payload);

  // change user's current room to his default room
  let updates = {};
  updates[`/users/${payload.id}/current_room/`] = payload.id;
  database()
    .ref()
    .update(updates);

  // remove user from members' list of the room
  database()
    .ref(`/rooms/${payload.rid}/members/${payload.id}`)
    .remove();
};
/************  members actions end **********/
