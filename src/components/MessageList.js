import React from 'react'
import ReactDOM from 'react-dom'
import Message from './Message'

class MessageList extends React.Component {

  componentWillUpdate(){
    const node = ReactDOM.findDOMNode(this)
    node.shouldScrollToBottom = node.scrollTop + node.clientHeight + 100 >= node.scrollHeight
  }

  componentDidUpdate(){
    if (this.shouldScrollToBottom) {
      const node = ReactDOM.findDOMNode(this)
      node.scrollTop = node.scrollHeight
    }
  }

  render () {
    // if (!this.props.roomId){
    //   console.log('Show me this.props.joinedRooms',this.props.roomId);
    //   return (
    //     <div className="message-list">
    //       <div className="join-room">
    //         &larr;
    //         <p className="join-room-text">Join A Room!</p>
    //       </div>
    //     </div>
    //   )
    // }
    return (
      <div className="message-list">
        {this.props.messages.map((message,index) => {
          console.log("what is the current message",message);
          console.log("what is the current username",this.props.username);
          return (
            <Message key={index} username={this.props.username} text={message}/>
          )
        })}
      </div>
    )
  }

}

export default MessageList
