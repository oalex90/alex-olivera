import React from 'react';
import $ from 'jquery';
import { Reply } from './reply';
import iconReport from '../../img/icon-report.svg';

/* Displays thread values
  Props:
    _id - thread id
    board  - board name
    text
    created_on
    replies - array of replies
    replycount - (optional field) number of total replies
    reported
    deleteThreadAction - function : action to be taken after thread has been deleted from db
*/
export class Thread extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        replies: this.props.replies,
        text: this.props.text,
        newText: "",
        newDeletePass: "",
        replycount: this.props.replycount,
        hideThread: this.props.reported
      };

      this.reportThread = this.reportThread.bind(this);
      this.deleteThread = this.deleteThread.bind(this);
      this.newReply = this.newReply.bind(this);
      this.onNewTextChange = this.onNewTextChange.bind(this);
      this.onNewDeletePassChange = this.onNewDeletePassChange.bind(this);
      this.revealThread = this.revealThread.bind(this);
    }

    reportThread(){
      var url = "/messageboard/api/threads/" + this.props.board;
      $.ajax({
        type: "PUT",
        url: url,
        data: {thread_id: this.props._id},
        success: (data)=>{
          this.setState({hideThread: true})
        }
      });
    }

    //delete thread from db and call state.deleteThreadAction
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

    //add reply to replies array in db and
    newReply(event){
      var url = "/messageboard/api/replies/" + this.props._id;
      $.ajax({
        type: "POST",
        url: url,
        data: {
          text: this.state.newText,
          delete_password: this.state.newDeletePass},
        success: data=>{
          //console.log("New reply Data:", data);
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

    revealThread(){
      this.setState({hideThread: false});
    }

    render() {
      //console.log("state.replies:", this.state.replies);
      let replies = this.state.replies.map(r=>{
        return(<Reply key={r._id}
                      reply_id={r._id}
                      thread_id={this.props._id}
                      created_on={r.created_on}
                      reported={r.reported}
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
          hiddenReplies = <section className="total-replies">
                  <h4>{this.state.replycount} Replies total ({hiddenCount} hidden)</h4>
                  <a href={"/messageboard/r/" + this.props._id}>See the full thread here</a>
              </section>
      }

      

      let createDate = new Date(this.props.created_on);

      let threadContents = <div>
        <div className="container-two">
          <section className="thread-text">
              <h3>{this.state.text}</h3>
          </section>

          <form className="create-reply" onSubmit={this.newReply}>
              <textarea name="reply-text" rows="3" placeholder="Quick reply..."
                value={this.state.newText} onChange={this.onNewTextChange} required/>
              <input type="password" placeholder="Delete password"
                value={this.state.newDeletePass} onChange={this.onNewDeletePassChange} required/>
              <input className="button-create" type="submit" value="Create Reply"/>
          </form>
        </div>
        <div className="replies-container">
          {hiddenReplies}

          {replies}
        </div>
      </div>;

      if(this.state.hideThread){
        threadContents = <section className="thread-text">
          <h3>Reported</h3>
          <a className="link-reported clickable" onClick={this.revealThread}>[reveal thread]</a>
        </section>
      }

      return (
        <div className="thread-container">
          <div className="thread-header">
              <div className="thread-id-date">
                  <p>id: {this.props._id}</p> 
                  <p>({createDate.toUTCString()})</p>
              </div>
              <div className="thread-delete-report">
                  <form className="delete-thread" onSubmit={this.deleteThread}>
                      <input type="password" name="delete_password" placeholder="Delete password" required/>
                      <input className="button-delete" type="submit" value="Delete Thread"/>
                  </form>
                  <a className="report clickable" onClick={this.reportThread}>
                      <img src={iconReport} alt="report icon"/>
                      <p>Report Thread</p>
                  </a>
              </div>
          </div>

          {threadContents}

        </div>
      );
    }
  }
