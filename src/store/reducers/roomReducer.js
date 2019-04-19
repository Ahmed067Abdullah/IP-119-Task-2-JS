import * as actionTypes from "../actions/actionTypes";

const initialState = {
  rooms: [],
  members: [],
  messages: [],
  room : {}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ROOM:
      console.log(action.payload);
      return {
        ...state,
        room : {...action.payload.room},
        members: {...action.payload.members},
        messages: {...action.payload.messages}
      };
    case actionTypes.SET_ROOMS_LIST:
      console.log(action.payload);
      return {
        ...state,
        rooms: {...action.payload}
      };
    case actionTypes.SIGNOUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
