import { database, auth } from "firebase";
import * as actionTypes from "./actionTypes";
import dispatcher from "../dispater";

// helper functions
const loginSuccessful = (dispatch, uid, name, history, match) => {
  const user = { uid, name };
  localStorage.setItem("chat-box", JSON.stringify(user));

  // if user is logging in with invited URL then set invited_to field in redux and navigate to that room
  if (match && match.params.id) {
    dispatch(dispatcher(actionTypes.SET_INVITED_ROOM, match.params.id));
    history.replace(`/chatbox/${match.params.id}`);
  }

  // save user obj in store
  dispatch(dispatcher(actionTypes.AUTH_SUCCESSFUL, user));
  console.log("login successful", user);
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

// for auto sign in if user was logged in and refreshed the page
export const setSignedIn = user => dispatch => {
  const { uid, name } = user;
  loginSuccessful(dispatch, uid, name);
};

export const signup = payload => dispatch => {
  const { name, email, password, rePass, history, match } = payload;
  const user = { email, name, online: true };

  // form validation
  if (rePass !== password) {
    authError(dispatch, "Passwords don't match", "errorSignUp");
    return;
  }

  if (!name) {
    authError(dispatch, "Name is required", "errorSignUp");
    return;
  }

  // create new user
  dispatch(dispatcher(actionTypes.START_LOADING));
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(async res => {
      const uid = res.user.uid;

      // after sign up
      // 1) save user info in the users node
      // 2) create a default room for the user
      // 3) add user as a member in his default room

      await database()  // 1
        .ref(`users/${uid}`)
        .set(user);
      await database()  // 2
        .ref(`rooms/${uid}`)
        .set({
          admin: uid,
          admin_name: name,
          created_at: Date.now(),
          name: `${name}'s Default Room`
        });
      await database()  // 3
        .ref(`rooms/${uid}/members/${uid}`)
        .set({ uid });

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

      // get logged in user info from users node
      const user = await database().ref(`users/${uid}`).once("value");

      // update online to true if user exists in the DB
      if (user.val()) {
        let updates = {};
        updates[`/users/${uid}/online`] = true;
        await database().ref().update(updates);

        loginSuccessful(dispatch, uid, user.val().name, history, match);
      } else console.log("user authenticated but not found in db");
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
  // on logout
  // 1) update online to false
  // 2) clear store
  // 3) clear local storage
  // 4) navigate back to auth page

  let updates = {}; // 1
  updates[`/users/${uid}/online`] = false;
  await database().ref().update(updates);

  dispatch(dispatcher(actionTypes.LOGOUT)); // 2

  localStorage.removeItem("chat-box"); // 3
  localStorage.removeItem("chat-box-current-room");

  history.replace("/auth"); // 4
};
