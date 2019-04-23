import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

// for initializing firebase and redux store
import initializeStore from "./store/store";
import initializeFirebase from "./firebase";

import App from "./App";
import "./index.css";

initializeFirebase();

const store = initializeStore();

const app = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
