import React, { Component } from "react";
import classes from "./ChatRoom.module.css";
import { connect } from "react-redux";
import * as actions from "../../store/actions/roomActions";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Button from "../../components/UI Components/Button/Button";
import Members from "../../components/Chat Room/Members/Members";
import Messages from "../../components/Chat Room/Messages/Messages";
import Rooms from "../../components/Chat Room/Rooms/Rooms";

class ChatBox extends Component {
  state = {
    message: ""
  };

  componentDidMount() {
    const { getRoom, getRoomsList, match, auth, history } = this.props;

    if (auth.uid) {
      const rid = match.params.id;
      getRoom(rid);
      getRoomsList(auth.uid);
    } else {
      alert("Please login to continue");
      history.replace("/auth");
    }
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  send = () => {
    const { sendMessage, room, auth } = this.props;
    sendMessage({
      text: this.state.message,
      room: room.room.rid,
      uid: auth.uid,
      posted_by: auth.name
    });
    this.setState({ message: "" });
  };

  onCopy = () => {
    alert("copied!");
  };

  render() {
    console.log("[room reducer]: ", this.props.room);
    const { messages, members, rooms, room } = this.props.room;
    let url = "http://localhost:3000/chatbox/";
    return (
      <div className={classes.main}>
        <div className={classes.members}>
          <Members members={members} />
        </div>
        <div className={classes.messages}>
          <Messages messages={messages} />
          <input
            value={this.state.message}
            onChange={this.handleChange}
            name="message"
          />
          <input type="button" onClick={this.send} value="Send" />

          <CopyToClipboard onCopy={this.onCopy} text={`${url}${room.rid}`}>
            <Button>Get Invitation Link</Button>
          </CopyToClipboard>
        </div>
        <div className={classes.rooms}>
          <Rooms rooms={rooms} />
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
