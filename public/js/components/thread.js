import React from 'react';
import $ from 'jquery';
import { Reply } from './reply';

export class Thread extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        replies: this.props.replies,
        text: this.props.text,
        newText: "",
        newDeletePass: "",
        replycount: this.props.replycount
      };

      this.reportThread = this.reportThread.bind(this);
      this.deleteThread = this.deleteThread.bind(this);
      this.newReply = this.newReply.bind(this);
      this.onNewTextChange = this.onNewTextChange.bind(this);
      this.onNewDeletePassChange = this.onNewDeletePassChange.bind(this);
    }

    reportThread(event){
      var url = "/messageboard/api/threads/" + this.props.board;
      $.ajax({
        type: "PUT",
        url: url,
        data: {thread_id: this.props._id},
        success: function(data) {
          alert(data);
        }
      });
      event.preventDefault();
    }

    deleteThread(event){
      var url = "/messageboard/api/threads/" + this.props.board;
      $.ajax({
        type: "DELETE",
        url: url,
        data: {
          thread_id: this.props._id,
          delete_password: event.target.delete_password.value},
        success: data => {
          if(data == "Delete successful"){
            this.props.deleteThreadAction(this.props._id);
          } else{
            alert(data);
          }
          
        }
      });
      event.preventDefault();
    }

    newReply(event){
      var url = "/messageboard/api/replies/" + this.props._id;
      $.ajax({
        type: "POST",
        url: url,
        data: {
          text: this.state.newText,
          delete_password: this.state.newDeletePass},
        success: data=>{
          console.log("New reply Data:", data);
          if(data._id){
            let newReplies;
            if(this.state.replycount != undefined && this.state.replycount > 2){
                newReplies = [data, ...this.state.replies.slice(0, 2)];
            } else{
                newReplies = [data, ...this.state.replies];
            }
            //console.log("newReplies: ", newReplies);
            this.setState({
              replies: newReplies,
              newText: "",
              newDeletePass: ""
            });
            if(this.state.replycount != undefined){
                this.setState({
                    replycount: this.state.replycount + 1
                });
            }
            
          } else{
            alert(data);
          }
        }
      });
      event.preventDefault();
    }

    onNewTextChange(event){
      this.setState({
        newText: event.target.value
      });
    }

    onNewDeletePassChange(event){
      this.setState({
        newDeletePass: event.target.value
      });
    }

    render() {
      //console.log("state.replies:", this.state.replies);
      let replies = this.state.replies.map(r=>{
        return(<Reply key={r._id}
                      reply_id={r._id}
                      thread_id={this.props._id}
                      created_on={r.created_on}
                      text={r.text}/>
        );
      });
      
      let hiddenReplies;
      //console.log("replycount:", this.state.replycount);
      if(this.props.replycount != undefined){
          let hiddenCount = this.state.replycount - 3;
          if (hiddenCount < 1){
              hiddenCount = 0;
          }
          hiddenReplies = <h5 className="thread-hidden-replies">
              {this.state.replycount} replies total ({hiddenCount} hidden)
              <a href={"/messageboard/r/" + this.props._id}>See the full thread here</a>.
          </h5>
      }

      let createDate = new Date(this.props.created_on);

      return (
        <div className="thread">
            <p className="thread-id">id: {this.props._id} ({createDate.toUTCString()})</p>
            <div className="thread-actions">
              <form className="thread-report" onSubmit={this.reportThread}>
                <input className="btn btn-outline-secondary" type="submit" value="Report Thread"/>
              </form>
              <form onSubmit={this.deleteThread}>
                <input type="text" name="delete_password" placeholder="delete password" required/>
                <input className="btn btn-outline-secondary" type="submit" value="Delete Thread"/>
              </form>
            </div>

            <h3 className="thread-text">{this.state.text}</h3>

            <div className="thread-new-reply">
              <form onSubmit={this.newReply}>
                <textarea style={{width: '100%'}} type="text" rows="3" placeholder="Quick reply..." 
                          value={this.state.newText} onChange={this.onNewTextChange} required/>
                <br/>
                <div className="new-reply-pass-submit">
                  <input type="text" placeholder="password to delete"
                        value={this.state.newDeletePass} onChange={this.onNewDeletePassChange} required/>
                  <input className="btn btn-primary" type="submit" value="Create Reply"/>
                </div>
              </form>
            </div>

            {hiddenReplies}
            
            {replies}
        </div>
      );
    }
  }
