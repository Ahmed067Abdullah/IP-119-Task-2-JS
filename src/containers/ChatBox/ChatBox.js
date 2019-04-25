import React, { Component } from "react";
import classes from "./ChatRoom.module.css";
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
import getTimeString from '../../common/getTimeString';

class ChatBox extends Component {
  state = {
    msg: ""
  };

  componentDidMount() {
    this.scrollToBottom();
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

    if (auth.uid) {
      const room = localStorage.getItem("chat-box-current-room");
      console.log("before::", rid);
      rid = rid ? rid : room ? room : auth.uid;
      console.log("after::", rid);
      getRoomsList(auth.uid);
      if (auth.invited_to) {
        const { invited_to, name, uid } = auth;
        addMember({
          rid: invited_to,
          name,
          uid
        });
        setInvitedRoom("");
        this.getRoom(getRoom, invited_to, history);
      } else {
        this.getRoom(getRoom, rid, history);
      }
    } else {
      alert("Please login to continue");
      setInvitedRoom(rid);
      history.replace("/auth");
    }
  };

  getRoom = (getRoom, rid, history) => {
    getRoom(rid, history);
    history.replace(`/chatbox/${rid}`);
    localStorage.setItem("chat-box-current-room", rid);
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  send = e => {
    e.preventDefault();
    const text = this.state.msg.trim();
    if (text) {
      const { sendMessage, room, auth } = this.props;
      console.log("sending", this.state);
      sendMessage({
        text,
        room: room.room.rid,
        uid: auth.uid,
        posted_by: auth.name
      });
      this.setState({ msg: "" });
    }
  };

  messageClicked = id => {
    const { messageClicked, room } = this.props;
    messageClicked(id, [...room.messages]);
  };

  onRemoveMember = id => {
    const { removeMember, room , auth} = this.props;
    removeMember({
      rid: room.room.rid,
      id
    });
  };

  onLogout = () => {
    const { history, onLogout, auth } = this.props;
    onLogout(history, auth.uid);
  };

  onCreateRoom = () => {
    const name = prompt("Choose Name for the new room").trim();
    if (name) {
      const { createRoom, auth, history } = this.props;
      createRoom({
        name,
        uid: auth.uid,
        uname: auth.name,
        history,
        setupRoom: this.setupRoom
      });
    }
  };

  onCopy = () => {
    alert("Invitation link is copied to the clip board!");
  };

  setEl = el => (this.el = el);

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
    getRoom: (rid, history) => dispatch(actions.getRoom(rid, history)),
    getRoomsList: uid => dispatch(actions.getRoomsList(uid)),
    sendMessage: text => dispatch(actions.sendMessage(text)),
    setInvitedRoom: link => dispatch(setInvitedRoom(link)),
    addMember: payload => dispatch(actions.addMember(payload)),
    removeMember: payload => dispatch(actions.removeMember(payload)),
    messageClicked: (id, msgs) => dispatch(actions.messageClicked(id, msgs)),
    onLogout: (history, uid) => dispatch(logout(history, uid))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatBox);
