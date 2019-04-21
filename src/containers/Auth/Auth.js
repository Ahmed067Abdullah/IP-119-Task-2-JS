import React, { Component } from "react";

import { connect } from "react-redux";
import * as actions from "../../store/actions/authActions";

import Button from "../../components/UI Components/Button/Button";
import Input from "../../components/UI Components/Input/Input";

import Card from "../..//hoc/Card";
import Spinner from "../../components/UI Components/Spinner/Spinner";
import classes from "./Auth.module.css";

class SignUp extends Component {
  state = {
    email: "a@gmail.com",
    password: "123456",
    rePass: "123456",
    name: "Ahmed",
    signUp: false
  };

  toggleAuthType = () => {
    this.setState(state => ({
      signUp: !state.signUp
    }));
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { onSignUp, onSignIn, history } = this.props;
    const { email, password, name } = this.state;
    const payload = { email, password, name, history };
    this.state.signUp ? onSignUp(payload) : onSignIn(payload);
    return false;
  };

  render() {
    const { email, password, rePass, name, signUp } = this.state;
    const { loading, error } = this.props.auth;
    let heading = "Sign In";
    let toggleText = (
      <p className={classes.auth_toggle_para}>
        <span>New Member? </span>
        <span className={classes.auth_toggle} onClick={this.toggleAuthType}>
          Sign Up
        </span>
      </p>
    );

    if (signUp) {
      heading = "Sign Up";
      toggleText = (
        <p className={classes.auth_toggle_para}>
          <span>Already Have an Account? </span>
          <span className={classes.auth_toggle} onClick={this.toggleAuthType}>
            Sign In
          </span>
        </p>
      );
    }

    return (
      <div className={classes.container}>
        <div className={classes.main}>
          <h1 className={classes.main_heading}>Welcome to ChatBox </h1>
          <div className="signup-card-container">
            {!loading ? (
              <Card>
                <h2 className={classes.heading}>{heading}</h2>
                <p className={classes.error}>{error ? error : null}</p>
                <form onSubmit={this.handleSubmit}>
                  <Input
                    label="Email"
                    changed={this.handleChange}
                    name="email"
                    value={email}
                  />
                  {signUp ? (
                    <Input
                      label="Name"
                      changed={this.handleChange}
                      name="name"
                      value={name}
                    />
                  ) : (
                    ""
                  )}
                  <Input
                    label="Password"
                    type="password"
                    changed={this.handleChange}
                    name="password"
                    value={password}
                  />
                  {signUp ? (
                    <Input
                      label="Repeat Password"
                      type="password"
                      changed={this.handleChange}
                      name="rePass"
                      value={rePass}
                    />
                  ) : (
                    ""
                  )}
                  <Button className="btn btn-success" clicked={this.handleSubmit}>
                    {heading}
                  </Button>
                </form>
                {toggleText}
              </Card>
            ) : (
              <div className="auth-spinner">
                <Spinner />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSignUp: history => dispatch(actions.signup(history)),
    onSignIn: history => dispatch(actions.signin(history))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);
