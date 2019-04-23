import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";

// actions
import { setSignedIn } from "./store/actions/authActions";

// getting routes
import getRoutes from "./routes";

// styles
import "./App.css";

class App extends Component {
  componentDidMount() {
    this.checkLoggedIn();
  }

  checkLoggedIn = () => {
    const user = JSON.parse(localStorage.getItem("chat-box"));
    if (user) this.props.setSignedIn(user);
  };

  render() {
    let routes = getRoutes(this.props.uid);
    return (
      <Router>
        <div className="App">{routes}</div>
      </Router>
    );
  }
}

const mapStateToProps = state => {
  return {
    uid: state.auth.uid
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setSignedIn: user => dispatch(setSignedIn(user))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
