import React from 'react';
import $ from 'jquery';

export class Reply extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      text: this.props.text
    }
    this.reportReply = this.reportReply.bind(this);
    this.deleteReply = this.deleteReply.bind(this);
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
        alert(data);
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

  render(){
    return (
      <div className="reply">
        <p className="reply-id">id: {this.props.reply_id} ({this.props.created_on}) </p>
        
        <div className="reply-actions">
          <form className="reply-report" onSubmit={this.reportReply}>
            <input className="btn btn-sm btn-outline-secondary" type="submit" value="Report Reply"/>
          </form>

          <form onSubmit={this.deleteReply}>
            <input type="text" name="delete_password" placeholder="delete password" required/>
            <input className="btn btn-sm btn-outline-secondary" type="submit" value="Delete Reply" />
          </form>
        </div>

        <h5 className="reply-text">{this.state.text}</h5>
      </div> 
    );
  }
}