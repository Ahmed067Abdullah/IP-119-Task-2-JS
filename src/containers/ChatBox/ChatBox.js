import React, { Component } from "react";
import classes from "./ChatRoom.module.css";
import { connect } from "react-redux";
import * as actions from "../../store/actions/roomActions";
import Members from "../../components/Chat Room/Members/Members";
import Messages from "../../components/Chat Room/Messages/Messages";
import Rooms from "../../components/Chat Room/Rooms/Rooms";

class ChatBox extends Component {
  state = {
    message: ""
  };

  componentDidMount() {
    const { getRoom, getRoomsList, match, auth } = this.props;
    const rid = match.params.id;
    getRoom(rid);
    getRoomsList(auth.uid);
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  send = () => {
    const { sendMessage, room, auth } = this.props;
    let uid = "123";
    sendMessage({
      message: this.state.message,
      room,
      uid
    });
  };

  render() {
    console.log("[room reducer]: ", this.props.room);
    return (
      <div className={classes.main}>
        <div className={classes.members}>
          <Members />
        </div>
        <div className={classes.messages}>
          <Messages />
          <input
            value={this.state.message}
            onChange={this.handleChange}
            name="message"
          />
          <input type="button" onClick={this.send} value="Send" />
        </div>
        <div className={classes.rooms}>
          <Rooms />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    room: state.room,
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getRoom: rid => dispatch(actions.getRoom(rid)),
    getRoomsList: uid => dispatch(actions.getRoomsList(uid)),
    sendMessage: text => dispatch(actions.sendMessage(text))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatBox);
