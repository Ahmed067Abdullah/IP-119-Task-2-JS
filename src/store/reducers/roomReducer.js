import * as actionTypes from "../actions/actionTypes";

const initialState = {
  rooms: [],
  members: [],
  messages: [],
  room: {}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ROOM:
      return {
        ...state,
        room: { ...action.payload.room },
        // members: [...action.payload.members],
        messages: [...action.payload.messages]
      };
    case actionTypes.SET_MEMBERS:
      return {
        ...state,
        members: [...action.payload]
      };
    case actionTypes.SET_ROOMS_LIST:
      return {
        ...state,
        rooms: [...action.payload]
      };
    case actionTypes.SET_MESSAGES:
      return {
        ...state,
        messages: [...action.payload]
      };
    case actionTypes.LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
