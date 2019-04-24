import dispatcher from "../dispater";
import { database } from "firebase";
import * as actionTypes from "./actionTypes";

const isMember = (uid, members) => members.find(member => member.uid === uid);

let usersRef;
let roomRef;

export const getRoom = (rid, history) => (dispatch, getState) => {
  console.log("func called, rid:", rid);
  // start loading
  dispatch(dispatcher(actionTypes.START_LOADING));
  dispatch(dispatcher(actionTypes.SET_MEMBERS, []));
  console.log("fetching for", rid);

  let oldMembers = [];
  const loggedInUser = getState().auth.uid;
  
  if(usersRef) usersRef.off();
  if(roomRef) roomRef.off();

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

export const addMember = payload => async dispatch => {
  const { uid, rid } = payload;
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
      .ref(`rooms/${rid}/members/${uid}`)
      .set({ uid });
  }
  console.log("new member:", newMem);
};

export const removeMember = payload => dispatch => {
  console.log("removing", payload);
  let updates = {};
  updates[`/users/${payload.id}/current_room/`] = payload.id;
  database()
    .ref()
    .update(updates);
  database()
    .ref(`/rooms/${payload.rid}/members/${payload.id}`)
    .remove();
};

export const messageClicked = (id, msgs) => dispatch => {
  const index = msgs.findIndex(msg => msg.id === id);
  msgs[index].clicked = !msgs[index].clicked;
  dispatch(dispatcher(actionTypes.SET_MESSAGES, msgs));
};
