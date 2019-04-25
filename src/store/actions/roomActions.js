import dispatcher from "../dispater";
import { database } from "firebase";
import * as actionTypes from "./actionTypes";
import isMember from "../../common/isMember";

// to store DB references
let usersRef;
let roomRef;

/************  room actions start **********/
export const createRoom = payload => async dispatch => {
  console.log("creating room");
  const { name, uid, uname, setupRoom } = payload;

  // to create room
  // 1) push new room in the rooms list
  // 2) add admin as a member in the members list of the room
  // 3) navigate to the new room and update UI according to new room

  const ref = await database() // 1
    .ref("/rooms")
    .push({
      admin: uid,
      created_at: Date.now(),
      name,
      admin_name: uname
    }).key;

  await database() // 2
    .ref(`rooms/${ref}/members`)
    .push({ name: uname, uid });

  setupRoom(ref); // 3
};

export const getRoom = (rid, history) => (dispatch, getState) => {
  console.log("fetching for", rid);

  // start loading and empty out the list of members
  dispatch(dispatcher(actionTypes.START_LOADING));
  dispatch(dispatcher(actionTypes.SET_MEMBERS, []));

  let oldMembers = [];
  const loggedInUser = getState().auth.uid;

  // detach listners if any were attached previously
  if (usersRef) usersRef.off();
  if (roomRef) roomRef.off();

  // update current room for the loggged in user
  let updates = {};
  updates[`/users/${loggedInUser}/current_room`] = rid;
  database()
    .ref()
    .update(updates)
    .then(() => {
      // setting users reference
      usersRef = database()
        .ref(`/users`)
        .orderByChild("online")
        .equalTo(true);

      // putting listener on the users node for online users
      usersRef.on("value", res => {
        // current members
        oldMembers = getState().room.members;

        // all online users
        const onlineUsers = res.val();

        // making members array
        const members = [];
        if (onlineUsers) {
          // push those online users in the array who are currently in that room
          for (let key in onlineUsers) {
            if (onlineUsers[key].current_room === rid) {
              members.push({
                id: key,
                uid: key,
                name: onlineUsers[key].name
              });
            }
          }

          // when user is removed from the group
          // if (
          //   !isMember(loggedInUser, members) &&
          //   isMember(loggedInUser, oldMembers)
          // ) {
          //   alert(`You're not the a member of room: ${loggedInUser} anymore`);
          //   moveToDefaultRoom(loggedInUser, history, dispatch);
          //   return;
          // }

          dispatch(dispatcher(actionTypes.SET_MEMBERS, members));

          // try to show pop up iff
          // 1) old members's array length isn't 0
          // 2) now there are more members than there were previosuly
          // 3) current user is logged in, in the same room
          if (
            oldMembers.length !== 0 &&
            oldMembers.length < members.length &&
            isMember(loggedInUser, members)
          ) {
            for (let i = 0; i < members.length; i++) {
              const member = members[i];
              // only show pop up for member who
              // 1) weren't in the room previously
              // 2) not the current user logged in
              if (
                !isMember(member.uid, oldMembers) &&
                member.uid !== loggedInUser
              )
                alert(`${member.name} just joined the room`);
            }
          }

          // if current user isn't a member of this room && still logged in then navigate him to default room
          if (!isMember(loggedInUser, members) && getState().auth.uid) {
            console.log("Removed");
            moveToDefaultRoom(loggedInUser, history, dispatch);
          }

          // update old members array with new members list
          oldMembers = [...members];
        }
      });

      roomRef = database().ref(`/rooms/${rid}`);
      roomRef.on("value", snapshot => {
        const roomData = snapshot.val();
        let payload = {};

        // if room exists store its messages and info, else move to default room
        if (roomData) {
          const { admin, admin_name, created_at, name } = roomData;

          // making messages array
          const messages = [];
          for (let key in roomData.messages)
            messages.push({
              id: key,
              ...roomData.messages[key],
              clicked: false
            });

          // making room info obj
          const room = { rid, admin, admin_name, created_at, name };

          payload = { room, messages };
        } else moveToDefaultRoom(loggedInUser, history, dispatch);

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

  database()
    .ref("/rooms/")
    .on("value", snapshot => {
      const roomsObj = snapshot.val();
      const rooms = [];

      // iterate over the list of members in each room, if current user is found
      // in the list of members then add that room in the rooms array
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
/************  room actions end **********/

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
