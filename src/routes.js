import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import Auth from "./containers/Auth/Auth";
import ChatRoom from "./containers/ChatBox/ChatBox";

const getRoutes = uid => {
  let routes = (
    <Switch>
      <Route path="/auth/:id" exact component={Auth} />
      <Route path="/auth" exact component={Auth} />
      <Redirect to="/auth" />
    </Switch>
  );

  if (uid) {
    routes = (
      <Switch>
        <Route path="/chatbox/:id" component={ChatRoom} />
        <Route path="/chatbox/" component={ChatRoom} />
        <Redirect to="/chatbox/" />
      </Switch>
    );
  }
  return routes;
};
export default getRoutes;
