import React, { Component } from "react";
import { connect } from "react-redux";

// actions
import * as actions from "../../store/actions/roomActions";
import { setInvitedRoom, logout } from "../../store/actions/authActions";

// components
import Header from "../../components/Chat Room/Header/Header";
import Spinner from "../../components/UI Components/Spinner/Spinner";
import Members from "../../components/Chat Room/Members/Members";
import Messages from "../../components/Chat Room/Messages/Messages";
import Rooms from "../../components/Chat Room/Rooms/Rooms";
import MessageInput from "../../components/Chat Room/MessageInput/MessageInput";

// base url
import url from "../../config/baseURL";

// helper func
import getTimeString from "../../common/getTimeString";

// stylesheet
import classes from "./ChatRoom.module.css";

class ChatBox extends Component {
  state = {
    msg: ""
  };

  componentDidMount() {
    this.scrollToBottom();

    // at first, try to show the room to which user is invited
    this.setupRoom(this.props.auth.invited_to);
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    if (this.el) {
      const scrollHeight = this.el.scrollHeight;
      const height = this.el.clientHeight;
      const maxScrollTop = scrollHeight - height;
      this.el.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  };

  setupRoom = rid => {
    const {
      getRoom,
      getRoomsList,
      auth,
      history,
      setInvitedRoom,
      addMember
    } = this.props;

    // only proceed iff user is logged in
    if (auth.uid) {
      const room = localStorage.getItem("chat-box-current-room");

      // rid      ==> invited_to OR the room's id on which user clicked
      // room     ==> room id stored in local storage
      // auth.uid ==> user id of the logged in users

      // at first navigate to room where user is invited
      // if he isn't invited to any then see if any room id is stored in localstorage
      // if not in localstorage too then navigate to his default room
      rid = rid ? rid : room ? room : auth.uid;

      // get list of rooms in which logged in user is added
      getRoomsList(auth.uid);

      // if user is invited to a room, then add him as a member in that room and reset invited_to field
      if (auth.invited_to) {
        const { invited_to, name, uid } = auth;
        addMember({
          rid: invited_to,
          name,
          uid
        });
        setInvitedRoom("");
      }

      // now fetch the room, change URL and save room id in localstorage
      getRoom(rid, history);
      history.replace(`/chatbox/${rid}`);
      localStorage.setItem("chat-box-current-room", rid);
    }
  };

  onCreateRoom = () => {
    const name = prompt("Choose Name for the new room");
    if (name && name.trim()) {
      const { createRoom, auth } = this.props;
      createRoom({
        name: name.trim(),
        uid: auth.uid,
        uname: auth.name,
        setupRoom: this.setupRoom
      });
    }
  };

  // to change msg value
  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  // to send msg
  send = e => {
    e.preventDefault();
    const text = this.state.msg.trim();

    // only send message if not empty string
    if (text) {
      const { sendMessage, room, auth } = this.props;
      sendMessage({
        text,
        room: room.room.rid,
        uid: auth.uid,
        posted_by: auth.name
      });
      this.setState({ msg: "" });
    }
  };

  // to show message sending time
  messageClicked = id => {
    const { messageClicked, room } = this.props;
    messageClicked(id, [...room.messages]);
  };

  onRemoveMember = id => {
    const { removeMember, room } = this.props;
    removeMember({
      rid: room.room.rid,
      id
    });
  };

  // to show popup when link is copied
  onCopy = () => {
    alert("Invitation link is copied to the clip board!");
  };

  // to store reference of the messages div in the variable
  setEl = el => (this.el = el);

  onLogout = () => {
    const { history, onLogout, auth } = this.props;
    onLogout(history, auth.uid);
  };

  render() {
    const { messages, members, rooms, room } = this.props.room;
    const { uid, loading } = this.props.auth;
    const { msg } = this.state;

    return !loading ? (
      <div className={classes.container}>
        <Header
          name={room.name}
          admin_name={room.admin_name}
          createdAt={getTimeString(room.created_at)}
          path={`${url}${room.rid}`}
          onCopy={this.onCopy}
          createRoom={this.onCreateRoom}
          logout={this.onLogout}
        />

        <div className={classes.main}>
          <div className={classes.members}>
            <Members
              members={members}
              admin={room.admin}
              onRemoveMember={this.onRemoveMember}
              canRemove={uid === room.admin}
              uid={uid}
            />
          </div>

          <div className={classes.messages}>
            <Messages
              messages={messages}
              uid={uid}
              setEl={this.setEl}
              messageClicked={this.messageClicked}
            />

            <MessageInput
              send={this.send}
              msg={msg}
              changed={this.handleChange}
            />
          </div>

          <div className={classes.rooms}>
            <Rooms rooms={rooms} setupRoom={this.setupRoom} cur={room.rid} />
          </div>
        </div>
      </div>
    ) : (
      <div>
        <Spinner />
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
    createRoom: payload => dispatch(actions.createRoom(payload)),
    setInvitedRoom: link => dispatch(setInvitedRoom(link)),
    getRoom: (rid, history) => dispatch(actions.getRoom(rid, history)),
    getRoomsList: uid => dispatch(actions.getRoomsList(uid)),
    sendMessage: text => dispatch(actions.sendMessage(text)),
    messageClicked: (id, msgs) => dispatch(actions.messageClicked(id, msgs)),
    addMember: payload => dispatch(actions.addMember(payload)),
    removeMember: payload => dispatch(actions.removeMember(payload)),
    onLogout: (history, uid) => dispatch(logout(history, uid))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatBox);
