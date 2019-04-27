import React, { Component } from "react";
import { connect } from "react-redux";

// actions
import * as actions from "../../store/actions/authActions";

// UI components
import Button from "../../components/UI Components/Button/Button";
import Input from "../../components/UI Components/Input/Input";
import Card from "../..//hoc/Card";
import Spinner from "../../components/UI Components/Spinner/Spinner";

// stylesheet
import classes from "./Auth.module.css";

class SignUp extends Component {
  // state = {
  //   email: "a@gmail.com",
  //   password: "123456",
  //   rePass: "123456",
  //   name: "Ahmed",
  //   signUp: false
  // };

  state = {
    email: "",
    password: "",
    rePass: "",
    name: "",
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
    const { onSignUp, onSignIn, history, match } = this.props;
    const { email, password, name, rePass } = this.state;
    const payload = {
      email: email.trim(),
      password: password.trim(),
      rePass: rePass.trim(),
      name: name.trim(),
      history,
      match
    };
    this.state.signUp ? onSignUp(payload) : onSignIn(payload);
  };

  render() {
    const { email, password, rePass, name, signUp } = this.state;
    const { loading, errorSignIn, errorSignUp } = this.props.auth;

    // setting default values
    let error = errorSignIn ? errorSignIn : "";
    let heading = "Sign In";
    let nameField = "";
    let rePassField = "";
    let toggleText = (
      <p className={classes.auth_toggle_para}>
        <span>New Member? </span>
        <span className={classes.auth_toggle} onClick={this.toggleAuthType}>
          Sign Up
        </span>
      </p>
    );

    // changing default values if signing up
    if (signUp) {
      heading = "Sign Up";
      error = errorSignUp;
      toggleText = (
        <p className={classes.auth_toggle_para}>
          <span>Already Have an Account? </span>
          <span className={classes.auth_toggle} onClick={this.toggleAuthType}>
            Sign In
          </span>
        </p>
      );
      nameField = (
        <Input
          label="Name"
          changed={this.handleChange}
          name="name"
          value={name}
        />
      );
      rePassField = (
        <Input
          label="Repeat Password"
          type="password"
          changed={this.handleChange}
          name="rePass"
          value={rePass}
        />
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
                <p className={classes.error}>{error}</p>
                <form onSubmit={this.handleSubmit}>
                  <Input
                    label="Email"
                    changed={this.handleChange}
                    name="email"
                    value={email}
                  />

                  {nameField}

                  <Input
                    label="Password"
                    type="password"
                    changed={this.handleChange}
                    name="password"
                    value={password}
                  />

                  {rePassField}

                  <Button
                    className="btn btn-primary"
                    clicked={this.handleSubmit}
                  >
                    {heading}
                  </Button>
                </form>

                {toggleText}
              </Card>
            ) : (
              <div>
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
