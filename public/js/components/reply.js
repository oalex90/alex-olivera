import React from 'react';
import $ from 'jquery';

/* Displays reply values for a given reply in replies array in a thread
  Props:
    reply_id
    thread_id
    created_on
    reported
    text
*/
export class Reply extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      text: this.props.text,
      hideText: this.props.reported
    }
    this.reportReply = this.reportReply.bind(this);
    this.deleteReply = this.deleteReply.bind(this);
    this.revealReplyText = this.revealReplyText.bind(this);
  }

  reportReply(event){ //update reply in db as reported and set state.hideText
    //console.log("thread_id", this.props.thread_id);
    //console.log("reply_id", this.props.reply_id);
    var url = "/messageboard/api/replies/" + this.props.thread_id;
    $.ajax({
      type: "PUT",
      url: url,
      data: {
        reply_id: this.props.reply_id,
      },
      success: data => { //if successful, hide reply text
        this.setState({
          hideText: true
        });
      }
    });
    event.preventDefault(); //prevent page from reloading
  }

  deleteReply(event){ //update reply text to "[deleted]" in db and set state.text
    var url = "/messageboard/api/replies/" + this.props.thread_id;
    $.ajax({
      type: "DELETE",
      url: url,
      data: {
        reply_id: this.props.reply_id,
        delete_password: event.target.delete_password.value //delete_password retrieved from form
      },
      success: data => {
        if (data == "Delete successful") {
          this.setState({
            text: "[deleted]"
          })
        } else{
          alert(data);
        }
      }
    });
    event.preventDefault();
  }

  revealReplyText(){ //set state.hideText to false
    this.setState({hideText: false});
  }

  render(){

    let isDeleted = this.state.text =="[deleted]"; //true if reply is deleted

    let replyText = <h5 className="reply-text">{this.state.text}</h5>; //assume reply is not deleted or reported, show reply text
    if(this.state.hideText && !isDeleted){ //if reply is deleted or reported, don't show reply text
      replyText = <div className="reply-reported-text"><h5 className="reply-text">reported</h5><p className="reply-reveal-text" onClick={this.revealReplyText}>[reveal text]</p></div>;
    }

    return (
      <div className="reply">
        <p className="reply-id">id: {this.props.reply_id} ({this.props.created_on}) </p>
        
        <div className="reply-actions">

          <form className="reply-report" onSubmit={this.reportReply} hidden={isDeleted}>
            <input className="btn btn-sm btn-outline-secondary" type="submit" value="Report Reply"/>
          </form>

          <form onSubmit={this.deleteReply} hidden={isDeleted}>
            <input type="text" name="delete_password" placeholder="delete password" required/>
            <input className="btn btn-sm btn-outline-secondary" type="submit" value="Delete Reply" />
          </form>
        </div>

        {replyText}
      </div> 
    );
  }
}