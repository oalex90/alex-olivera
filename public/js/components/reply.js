import React from 'react';
import $ from 'jquery';

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

  reportReply(event){
    //console.log("thread_id", this.props.thread_id);
    //console.log("reply_id", this.props.reply_id);
    var url = "/messageboard/api/replies/" + this.props.thread_id;
    $.ajax({
      type: "PUT",
      url: url,
      data: {
        reply_id: this.props.reply_id,
      },
      success: data => {
        this.setState({
          hideText: true
        });
      }
    });
    event.preventDefault();
  }

  deleteReply(event){

    var url = "/messageboard/api/replies/" + this.props.thread_id;
    $.ajax({
      type: "DELETE",
      url: url,
      data: {
        reply_id: this.props.reply_id,
        delete_password: event.target.delete_password.value
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

  revealReplyText(){
    this.setState({hideText: false});
  }

  render(){

    let isDeleted = this.state.text =="[deleted]";

    let replyText = <h5 className="reply-text">{this.state.text}</h5>;
    if(this.state.hideText && !isDeleted){
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