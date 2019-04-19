import * as actionTypes from "../actions/actionTypes";

const initialState = {
  rooms: [],
  members: [],
  messages: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ROOM:
      console.log(action.payload);
      return {
        ...state,
        members: action.payload.members,
        messages: action.payload.messages
      };
    case actionTypes.SET_ROOMS_LIST:
      console.log(action.payload);
      return {
        ...state,
        rooms: action.payload.rooms
      };
    case actionTypes.SIGNOUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
