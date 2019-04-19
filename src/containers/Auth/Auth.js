import React, { Component } from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import * as actions from "../../store/actions/authActions";

import Button from "../../components/UI Components/Button/Button";
import Input from "../../components/UI Components/Input/Input";

import Card from "../..//hoc/Card";
import Spinner from "../../components/UI Components/Spinner/Spinner";

class SignUp extends Component {
  state = {
    email: "a@gmail.com",
    password: "123456",
    rePass: "123456",
    name: "ahmed",
    loading: false,
    error: "",
    signUp: true
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

  handleSubmit = () => {
    const { onSignUp, onSignIn, history } = this.props;
    const { email, password, name } = this.state;
    const payload = { email, password, name, history };
    this.state.signUp ? onSignUp(payload) : onSignIn(payload);
    return false;
  };

  render() {
    const {
      email,
      password,
      rePass,
      name,
      signUp
    } = this.state;
    const {loading, error} = this.props.auth;
    let heading = "Sign In";
    let toggleText = (
      <p>
        New Member? <span onClick={this.toggleAuthType}> Sign Up</span>
      </p>
    );

    if (signUp) {
      heading = "Sign Up";
      toggleText = (
        <p>
          Already Have an Account?{" "}
          <span onClick={this.toggleAuthType}> Sign In</span>
        </p>
      );
    }

    return (
      <div style={{ marginTop: 110 }}>
        <h1 className="main-heading-signup">Welcome to ChatBox </h1>
        <div className="signup-card-container">
          {!loading ? (
            <Card>
              <h2 className="singin-heading">{heading}</h2>
              <p className="Error">{error ? error : null}</p>
              {/* <form onSubmit="return this.handleSubmit()"> */}
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
                <Button className="auth-button" clicked={this.handleSubmit}>{heading}</Button>
              {/* </form> */}
              {toggleText}
            </Card>
          ) : (
            <div className="auth-spinner">
              <Spinner />
            </div>
          )}
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

