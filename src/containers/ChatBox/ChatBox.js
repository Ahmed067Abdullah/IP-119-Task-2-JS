import React, { Component } from "react";
import classes from "./ChatRoom.module.css";
import { connect } from "react-redux";
import * as actions from "../../store/actions/roomActions";
import Members from "../../components/Chat Room/Members/Members";
import Messages from "../../components/Chat Room/Messages/Messages";
import Rooms from "../../components/Chat Room/Rooms/Rooms";

class ChatBox extends Component {
    state = {
        message : ""
    }
  
    componentDidMount() {
    const { getRoom, match } = this.props;
    const rid = match.params.id;
    getRoom(rid);
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  sendMessage = () => {
      console.log("Sending message",this.state.message);
  }

  render() {
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
            <input
             type="button"
             onClick={this.sendMessage}
             value="Send"
            />
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
    room: state.room
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getRoom: rid => dispatch(actions.getRoom(rid))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatBox);
