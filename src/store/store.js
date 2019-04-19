import { createStore, compose, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import authReducer from "./reducers/authReducer";
import roomReducer from "./reducers/roomReducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = combineReducers({
  auth: authReducer,
  room : roomReducer
});

const initializeStore = () => createStore( reducers, composeEnhancers( applyMiddleware( thunk ) ) );

export default initializeStore;
