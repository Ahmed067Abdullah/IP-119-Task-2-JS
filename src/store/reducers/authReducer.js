import * as actionTypes from "../actions/actionTypes";

const initialState = {
  uid: "",
  name: "",
  loading: false,
  errorSignIn: "",
  errorSignUp: "",
  invited_to: ""
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.START_LOADING:
      return {
        ...state,
        loading: true
      };
    case actionTypes.STOP_LOADING:
      return {
        ...state,
        loading: false
      };
    case actionTypes.AUTH_SUCCESSFUL:
      const { uid, name } = action.payload;
      return {
        ...state,
        uid,
        name,
        errorSignIn: "",
        errorSignUp: "",
        loading: false
      };
    case actionTypes.AUTH_ERROR:
      const { errorMsg, errorType } = action.payload;
      console.log(action.payload);
      return {
        ...state,
        [errorType]: errorMsg
      };
    case actionTypes.SET_INVITED_ROOM:
      return {
        ...state,
        invited_to: action.invited_to
      };
    case actionTypes.LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
