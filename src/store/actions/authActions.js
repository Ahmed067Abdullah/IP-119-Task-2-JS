import { database, auth } from "firebase";
import * as actionTypes from "./actionTypes";
import dispatcher from "../dispater";

// helper functions
const loginSuccessful = (dispatch, uid, name, history) => {
  const user = { uid, name };
  localStorage.setItem("chat-box", JSON.stringify(user));
  dispatch(dispatcher(actionTypes.AUTH_SUCCESSFUL, user));
  console.log("login successful", user);
  history.replace(`/chatbox/${uid}`);
  // history.replace(`/chatbox/ff1Cy3w7QnXCNlxNn9FTYb3sAjb2`);
};

const loginFailed = dispatch => {
  dispatch(dispatcher(actionTypes.STOP_LOADING));
  console.log("error in sign in after authenticating");
};

// actions
export const setSignedIn = user => dispatch => {
  const { uid, name, status, type } = user;
  loginSuccessful(dispatch, uid, name, status, type);
};

// export const signup = payload => dispatch => {
//   const { name, email, password, history } = payload;
//   const user = { email, name };

//   dispatch(dispatcher(actionTypes.START_LOADING));
//   auth()
//     .createUserWithEmailAndPassword(email, password)
//     .then(res => {
//       const uid = res.user.uid;
//       database()
//         .ref(`users/${uid}`)
//         .set(user)
//         .then(() => {
//           database()
//             .ref(`rooms/${uid}`)
//             .set({
//               admin: uid,
//               created_at: Date.now(),
//               name: `${name}'s Default Room`
//             })
//             .then(() => {
//               database()
//                 .ref(`rooms/${uid}/members`)
//                 .push({
//                   name,
//                   uid
//                 })
//                 .then(() => {
//                   loginSuccessful(dispatch, uid, name, history);
//                 });
//             });
//         });
//     })
//     .catch(error => {
//       dispatch(dispatcher(actionTypes.STOP_LOADING));
//       let errorMessage = "";
//       if (error.code === "auth/email-already-in-use")
//         errorMessage = "Account For This Email is Already Registered";
//       else if (error.code === "auth/invalid-email")
//         errorMessage = "Invalid Email";
//       else errorMessage = error.message;
//       console.log(errorMessage);
//       dispatch(dispatcher(actionTypes.AUTH_ERROR, { error: errorMessage }));
//     });
// };

export const signup = payload => dispatch => {
  const { name, email, password, history } = payload;
  const user = { email, name };

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
          created_at: Date.now(),
          name: `${name}'s Default Room`
        });
      await database()
        .ref(`rooms/${uid}/members`)
        .push({ name, uid });
      loginSuccessful(dispatch, uid, name, history);
    })
    .catch(error => {
      dispatch(dispatcher(actionTypes.STOP_LOADING));
      let errorMessage = "";
      if (error.code === "auth/email-already-in-use")
        errorMessage = "Account For This Email is Already Registered";
      else if (error.code === "auth/invalid-email")
        errorMessage = "Invalid Email";
      else errorMessage = error.message;
      dispatch(dispatcher(actionTypes.AUTH_ERROR, { error: errorMessage }));
    });
};

export const signin = payload => dispatch => {
  const { email, password, history } = payload;
  dispatch(dispatcher(actionTypes.START_LOADING));
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(res => {
      const uid = res.user.uid;
      database()
        .ref(`users/${uid}`)
        .once("value")
        .then(res => {
          if (res.val())
            loginSuccessful(dispatch, uid, res.val().name, history);
        })
        .catch(err => {
          loginFailed(dispatch);
        });
    })
    .catch(error => {
      dispatch(dispatcher(actionTypes.STOP_LOADING));
      let errorMessage = "";
      if (error.code === "auth/wrong-password") errorMessage = "Wrong Password";
      else if (error.code === "auth/user-not-found")
        errorMessage = "User Doesn't Exist";
      else errorMessage = error.message;
      dispatch(dispatcher(actionTypes.AUTH_ERROR, { error: errorMessage }));
    });
};

export const signout = () => dispatch => {
  dispatch(dispatcher(actionTypes.SIGNOUT));
  localStorage.removeItem("crs");
};
