import * as actionTypes from "../actions/actionTypes";

const initialState = {
  uid: "R1KXP4gnEegAEYcw0AjoYoRy0RE3",
  name: "Ahmed",
  loading: false,
  error: "",
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
        error: "",
        loading: false
      };
    case actionTypes.AUTH_ERROR:
      return {
        ...state,
        error: action.payload.error
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
