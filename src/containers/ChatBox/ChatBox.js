import React, { Component } from "react";
import classes from "./ChatRoom.module.css";
import { connect } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";

// actions
import * as actions from "../../store/actions/roomActions";
import { setInvitedRoom, logout } from "../../store/actions/authActions";

// components
import Button from "../../components/UI Components/Button/Button";
import Members from "../../components/Chat Room/Members/Members";
import Messages from "../../components/Chat Room/Messages/Messages";
import Rooms from "../../components/Chat Room/Rooms/Rooms";

class ChatBox extends Component {
  state = {
    message: ""
  };

  componentDidMount() {
    this.setupRoom(this.props.match.params.id);
  }

  setupRoom = rid => {
    console.log("here");
    const {
      getRoom,
      getRoomsList,
      auth,
      history,
      setInvitedRoom,
      addMember
    } = this.props;

    if (auth.uid) {
      getRoomsList(auth.uid);
      if (auth.invited_to) {
        const { invited_to, name, uid } = auth;
        addMember({
          rid: invited_to,
          name,
          uid
        });
        getRoom(invited_to);
        setInvitedRoom("");
        history.replace(`/chatbox/${invited_to}`);
      } else getRoom(rid);
    } else {
      alert("Please login to continue");
      setInvitedRoom(rid);
      history.replace("/auth");
    }
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  send = e => {
    e.preventDefault();
    const { sendMessage, room, auth } = this.props;
    sendMessage({
      text: this.state.message,
      room: room.room.rid,
      uid: auth.uid,
      posted_by: auth.name
    });
    this.setState({ message: "" });
  };

  onLogout = () => {
    const { history, onLogout } = this.props;
    onLogout(history);
  };

  onCopy = () => {
    alert("Invitation link is copied to the clip board!");
  };

  getTimeString = time => new Date(time).toString().slice(0, 24)

  render() {
    const { messages, members, rooms, room } = this.props.room;
    const { uid } = this.props.auth;
    let url = "http://localhost:3000/chatbox/";
    return (
      <div className={classes.container}>
        <div>
          <div>Room : {room.name}</div>{" "}
          <div>
            Created At : {this.getTimeString(room.created_at)}
          </div>
        </div>
        <div className={classes.main}>
          <div className={classes.members}>
            <Members members={members} />
          </div>
          <div className={classes.messages}>
            <Messages messages={messages} uid={uid} />
            <form onSubmit={this.send}>
              <input
                value={this.state.message}
                onChange={this.handleChange}
                name="message"
              />
              <input type="button" onClick={this.send} value="Send" />
            </form>
            <CopyToClipboard onCopy={this.onCopy} text={`${url}${room.rid}`}>
              <button>Get Invitation Link</button>
            </CopyToClipboard>
            <Button clicked={this.onLogout}>Logout</Button>
          </div>
          <div className={classes.rooms}>
            <Rooms rooms={rooms} setupRoom={this.setupRoom} />
          </div>
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
    sendMessage: text => dispatch(actions.sendMessage(text)),
    setInvitedRoom: link => dispatch(setInvitedRoom(link)),
    addMember: payload => dispatch(actions.addMember(payload)),
    onLogout: history => dispatch(logout(history))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatBox);
