import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import Auth from "./containers/Auth/Auth";
import ChatRoom from "./containers/ChatBox/ChatBox";

const getRoutes = () => (
    <Switch>
      <Route path="/auth" exact component={Auth} />
      <Route path="/chatbox/:id" component={ChatRoom} />
      <Redirect to="/auth" />
    </Switch>
  )
  
export default getRoutes;
