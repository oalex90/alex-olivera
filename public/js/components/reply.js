import React from 'react';
import $ from 'jquery';
import iconReport from '../../img/icon-report.svg';

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

  reportReply(){ //update reply in db as reported and set state.hideText
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

    let replyText =  <section className="reply-text">
              <h4>{this.state.text}</h4>
          </section>;
    
    if(this.state.hideText && !isDeleted){ //if reply is deleted or reported, don't show reply text
      replyText = <section className="reply-text">
        <h4>reported</h4>
        <a className="link-reported clickable" onClick={this.revealReplyText}>[reveal text]</a>
      </section>;
    }

    return (
      <div className="reply-container">
          <div className="reply-id-date">
              <p>id: {this.props.reply_id}</p> 
              <p>({this.props.created_on})</p>
          </div>
          {replyText}
          <div className="reply-delete-report">
              <form className="delete-reply" onSubmit={this.deleteReply} hidden={isDeleted}>
                  <input type="password" name="delete_password" placeholder="Delete password" required/>
                  <input className="button-delete" type="submit" value="Delete Reply"/>
              </form>
              <div hidden={isDeleted}>
              <a className="report clickable" onClick={this.reportReply}>
                  <img src={iconReport} alt="report icon"/>
                  <p>Report Reply</p>
              </a>
              </div>
          </div>
      </div>
    );
  }
}