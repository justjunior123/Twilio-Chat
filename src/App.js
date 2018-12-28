import React from 'react';

import MessageList from './components/MessageList'
import SendMessageForm from './components/SendMessageForm'
import RoomList from './components/RoomList'
import NewRoomForm from './components/NewRoomForm'
import './App.css';

import $ from 'jquery'
let Twilio = window.Twilio;
const Chat = require('twilio-chat');

class App extends React.Component {

  constructor(props){
    super(props)
    console.log('These are our props: ',props);
    this.state = {
      username: null,
      roomId: null,
      channel: null,
      messages: [],
      joinableRooms: [],
      joinedRooms: []
    }
    this.getToken = this.getToken.bind(this)
    this.createChatClient = this.createChatClient.bind(this)
    this.handleNewMessage = this.handleNewMessage.bind(this)
    this.joinChannel = this.joinChannel.bind(this)
    this.configureChannelEvents = this.configureChannelEvents.bind(this)
  }

  componentDidMount() {

        this.getToken()
          .then(this.createChatClient)
          .then(this.joinChannel)
          .then(this.configureChannelEvents/*(this.joinChannel)*/)
          .catch((error) => {
            this.setState({
              messages: [...this.state.messages, { body: `Error: ${error.message}` }],
          })
        })
  }
// *********************************************************************


    getToken = () => {
      let _this = this;
      console.log(this);
      return new Promise((resolve, reject) => {

        $.getJSON('/token', (token) => {
          _this.setState({ username: token.identity })
          resolve(token)
          console.log(token.jwt)
        })
        .fail(() => {
          reject(Error("Failed to connect."))
        })
      })
    }

    // -----------------------------------------------------------------
    // Helper Function for adding messages

    addMessage = (message) => {
      const messageData = { ...message, me: message.author === this.state.username }
      this.setState({
        messages: [...this.state.messages, messageData],
      })
    }

    // -----------------------------------------------------------------

    createChatClient = (token) => {
      console.log('We are in the Create Client: ')
      return Chat.Client.create(token.jwt)
    }

    joinChannel = (chatClient) => {
      console.log(chatClient);
      chatClient.getChannelByUniqueName('general').then( (channel) => {
        console.log("this is the current channel",channel);

        channel.join().then((channel) => {
          console.log('You have joined the ',channel.friendlyName);
          this.setState({
            joinedRooms: channel.friendlyName,
            channel
          })
          console.log('outside of setting the state',channel);
          return channel
        })
        .catch((err) => {
          console.log('Could not join channel because of ',err);
        })

        channel.on('memberJoined', (member) => {
          console.log('Channel Events is working ', member.identity);
        })
      })
    }

    configureChannelEvents = (channel /*,callback*/) => {
      console.log('Listening to channel events',this.state.channel);
      // if (this.state.channel) {
        // channel.on('messageAdded').then((message) => {
        //   console.log('trying to handle message callback ',message);
        //   this.handleNewMessage(message)
        // })
        // .catch( (err) => {
        //   console.log("Could not could not send message ",err);
        // })
        // callback();
        // channel.on('memberJoined', (member) => {
        //   console.log('Channel Events is working ', this.member.username);
        // })
        // channel.getMessages().then(function(messages) {
        //   const totalMessages = messages.items.length;
        //     for (let i = 0; i < totalMessages; i++) {
        //       const message = messages.items[i];
        //       console.log('Author:' + message.author);
        //     }
        //   console.log('Total Messages:' + totalMessages);
        // });
      // }
    }

    handleNewMessage = (text) => {
      console.log('we are handling text ',text);
      if (this.state.channel) {
        console.log('About to send message ', this.state.channel.sendMessage(text));
        this.state.channel.sendMessage(text); // actually sends text to twilio for records
        this.setState({
          messages: [...this.state.messages,text]
        })
      }
    }


  render() {
    return (
      <div className="App">
        <RoomList
          roomId={this.state.roomId}
          subscribeToRoom = {this.subscribeToRoom}
          rooms={[...this.state.joinableRooms,...this.state.joinedRooms]} />
        <MessageList
          username={ this.state.username}
          roomId={ this.state.joinedRooms}
          messages={ this.state.messages } />
        <SendMessageForm
          disabled={!this.state.joinableRooms}
          sendMessage={ this.handleNewMessage} /> {/* Inverse data flow concept, we are sending this.sendMessage down as a*/}
        <NewRoomForm createRoom={ this.createRoom }/> {/* prop to the SendMessageForm component. Allowing the child component to have access to the method*/}
      </div>
    );
  }
}

export default App;
