import { database, auth } from "firebase";
import * as actionTypes from "./actionTypes";
import dispatcher from "../dispater";

// helper functions
const loginSuccessful = (dispatch, uid, name, history, match) => {
  const user = { uid, name };
  localStorage.setItem("chat-box", JSON.stringify(user));
  if (match && match.params.id) {
    dispatch(dispatcher(actionTypes.SET_INVITED_ROOM, match.params.id));
    history.replace(`/chatbox/${match.params.id}`);
  } else if (history) history.replace(`/chatbox/${uid}`);
  dispatch(dispatcher(actionTypes.AUTH_SUCCESSFUL, user));
  console.log("login successful", user);
};

const loginFailed = dispatch => {
  dispatch(dispatcher(actionTypes.STOP_LOADING));
  console.log("error in sign in after authenticating");
};

const authError = (dispatch, msg, type) => {
  dispatch(
    dispatcher(actionTypes.AUTH_ERROR, {
      errorMsg: msg,
      errorType: type
    })
  );
};

// actions
export const setSignedIn = user => dispatch => {
  console.log("Login successful");
  const { uid, name } = user;
  loginSuccessful(dispatch, uid, name);
};

export const signup = payload => dispatch => {
  const { name, email, password, rePass, history, match } = payload;
  const user = { email, name, online: true };

  if (rePass !== password) {
    authError(dispatch, "Passwords don't match", "errorSignUp");
    return;
  }

  if (!name) {
    authError(dispatch, "Name is required", "errorSignUp");
    return;
  }

  dispatch(dispatcher(actionTypes.START_LOADING));
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(async res => {
      const uid = res.user.uid;
      await database()
        .ref(`users/${uid}`)
        .set(user);
      await database()
        .ref(`rooms/${uid}`)
        .set({
          admin: uid,
          admin_name: name,
          created_at: Date.now(),
          name: `${name}'s Default Room`
        });
      await database()
        .ref(`rooms/${uid}/members`)
        .push({ name, uid });
      loginSuccessful(dispatch, uid, name, history, match);
    })
    .catch(error => {
      dispatch(dispatcher(actionTypes.STOP_LOADING));
      let errorMessage = "";
      if (error.code === "auth/email-already-in-use")
        errorMessage = "Account For This Email is Already Registered";
      else if (error.code === "auth/invalid-email")
        errorMessage = "Invalid Email";
      else errorMessage = error.message;
      authError(dispatch, errorMessage, "errorSignUp");
    });
};

export const signin = payload => dispatch => {
  const { email, password, history, match } = payload;
  dispatch(dispatcher(actionTypes.START_LOADING));
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(async res => {
      const uid = res.user.uid;
      const user = await database()
        .ref(`users/${uid}`)
        .once("value");
      if (user.val()) {
        let updates = {};
        updates[`/users/${uid}/online`] = true;
        await database()
          .ref()
          .update(updates);
        loginSuccessful(dispatch, uid, user.val().name, history, match);
      }
    })
    .catch(error => {
      dispatch(dispatcher(actionTypes.STOP_LOADING));
      let errorMessage = "";
      if (error.code === "auth/wrong-password") errorMessage = "Wrong Password";
      else if (error.code === "auth/user-not-found")
        errorMessage = "User Doesn't Exist";
      else errorMessage = error.message;
      authError(dispatch, errorMessage, "errorSignIn");
    });
};

export const setInvitedRoom = invited_to => {
  return {
    type: actionTypes.SET_INVITED_ROOM,
    payload: invited_to
  };
};

export const logout = (history, uid) => async dispatch => {
  dispatch(dispatcher(actionTypes.LOGOUT));
  let updates = {};
  updates[`/users/${uid}/online`] = false;
  await database()
    .ref()
    .update(updates);
  localStorage.removeItem("chat-box");
  localStorage.removeItem("chat-box-current-room");
  history.replace("/auth");
};
