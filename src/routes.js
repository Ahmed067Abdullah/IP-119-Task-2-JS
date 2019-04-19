import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import Auth from "./containers/Auth/Auth";

const getRoutes = status => {
  let routes = (
    <Switch>
      <Route path="/auth" exact component={Auth} />
      <Redirect to="/auth" />
    </Switch>
  );

  // routes for admin
  // if (status) {
  //   routes = (
  //     <Switch>
  //       <Route path="/students" component={Students} />
  //       <Route path="/vacancies" component={Vacancies} />
  //       <Route path="/companies" component={Companies} />
  //       <Route path="/logout" component={Logout} />
  //       <Redirect to="/students" />
  //     </Switch>
  //   );
  // }

  return routes;
};

export default getRoutes;
