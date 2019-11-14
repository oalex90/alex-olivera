import '../css/messageboard.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { Thread } from '../js/components/thread';

$(document).ready(function() {
  var base_url = window.location.origin + "/messageboard/";
  console.log("pathname:", window.location.pathname);
  var currentBoard = window.location.pathname.replace("/messageboard/","");
  currentBoard = currentBoard.replace(/\/*$/, "");
  console.log("currentBoard:", currentBoard);
  var url = "/messageboard/api/threads/" + currentBoard;
  console.log("url:", url);
  var url2 = "/messageboard/r/";
  $("#boardTitle").text("Welcome to " + window.location.pathname);
  
  class MyComponent extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        threads: [],
        error: null
      };
      this.newThread = this.newThread.bind(this);
      this.onNewTextChange = this.onNewTextChange.bind(this);
      this.onNewDeletePassChange = this.onNewDeletePassChange.bind(this);
      this.deleteThreadAction = this.deleteThreadAction.bind(this);
    }

    componentDidMount() {
      console.log("mounting");
      fetch("/messageboard/api/threads/" + currentBoard)
        .then(res => res.json())
        .then(
          (result) => {
            console.log("fetch result", result);
            this.setState({
              threads: result
            });
          },
          (error) => {
            this.setState({error});
          }
        );
    }

    newThread(event){
      var url = "/messageboard/api/threads/" + currentBoard;
      $.ajax({
        type: "POST",
        url: url,
        data: {
          text: this.state.newText,
          delete_password: this.state.newDeletePass},
        success: data=>{
          console.log("New thread data:", data);
          if(data._id){
            let newThreads = [data, ...this.state.threads];
            //console.log("newThreads: ", newThreads);
            this.setState({
              threads: newThreads,
              newText: "",
              newDeletePass: ""
            });
            
          } else{
            alert(JSON.stringify(data));
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

    deleteThreadAction(thread_id) {
      let index = 0;
      let threads = this.state.threads;
      for(index; index<threads.length; index++){
        if(threads[index]._id == thread_id){
          break;
        }
      }
      this.setState({
        threads: [...threads.slice(0,index), ...threads.slice(index+1)]
      });
    }

    render(){
      let threads;
      if(this.state.threads){
        threads = this.state.threads.map(t=>{
          return (<Thread 
            key={t._id}
            _id={t._id}
            board={t.board}
            text={t.text}
            created_on={t.created_on}
            replies={t.replies}
            replycount={t.replycount}
            deleteThreadAction={this.deleteThreadAction}
          />);
        })
      } else if(this.state.error){
        threads = <div>An Error Has Occured</div>;
      }

      return (
      <div className="board">
        <div id="submitNewThread" className="newThread">
          <h3>Create a new thread:</h3>
          <form id="newThread" onSubmit={this.newThread}>
            <textarea type="text" rows="8" cols="120" placeholder="Thread text..." 
                      value={this.state.newText} onChange={this.onNewTextChange} required/>
            <br/>
            <input type="text" placeholder="password to delete"
                    value={this.state.newDeletePass} onChange={this.onNewDeletePassChange} required/>
            <input type="submit" value="Create Thread"/>
          </form>
        </div>
        
        {threads}
      </div>);
      
    }
  }

  ReactDOM.render(<MyComponent/>, document.getElementById('board'));

});
