import '../css/messageboard.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { Thread } from '../js/components/thread';

$(document).ready(function() {

  var currentBoard = window.location.pathname.replace("/messageboard/",""); //get board name from url
  currentBoard = currentBoard.replace(/\/*$/, ""); //remove '/' chars
  
  class MyComponent extends React.Component{
    constructor(props){
      super(props);
      this.state = { //initialize state variables
        threads: [],
        error: null
      };
      this.newThread = this.newThread.bind(this); //allows newThread function to use this.state to refer to state object
      this.onNewTextChange = this.onNewTextChange.bind(this);
      this.onNewDeletePassChange = this.onNewDeletePassChange.bind(this);
      this.deleteThreadAction = this.deleteThreadAction.bind(this);
    }

    componentDidMount() { //called after react object is rendered successfully for first time
      //console.log("mounting");
      fetch("/messageboard/api/threads/" + currentBoard)
        .then(res => res.json())
        .then(
          (result) => {
            //console.log("fetch result", result);
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
          //console.log("New thread data:", data);
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
            reported={t.reported}
            deleteThreadAction={this.deleteThreadAction}
          />);
        })
      } else if(this.state.error){
        threads = <div>An Error Has Occured</div>;
      }

      return (
        <div className="container">
            <div id="board-container">
                <h2>{currentBoard}</h2>
                <div className="container-two">
                    <form id="form-change-board">
                        <input id="board_input" type="text" name="board-name" placeholder="Board Name"/>
                        <input id="button-change-board" type="submit" value="Change Board"/>
                    </form>
                    <h3>Create a new thread:</h3>
                    <form id="form-new-thread" onSubmit={this.newThread}>
                        <textarea rows="3" placeholder="Thread text..." 
                            value={this.state.newText} onChange={this.onNewTextChange} required/>
                        <input type="password" placeholder="Delete password"
                            value={this.state.newDeletePass} onChange={this.onNewDeletePassChange} required/>
                        <input className="button-create" type="submit" value="Create Thread"/>
                    </form>
                </div> 
            </div>
            {threads}
        </div>
      );
    }
  }

  ReactDOM.render(<MyComponent/>, document.getElementById('app'));

  $("#form-change-board").on("submit", function(e) {
    console.log("changing board");
    let input = $("#board_input")
        .val()
        .toLowerCase();
    console.log("board input",input);
    input = input.replace(/^\s+/g, ""); // remove spaces from beginning
    input = input.replace(/\s+$/g, ""); // remove spaces from end
    input = input.replace(/\s/g, "_"); // convert spaces to underscores
    input = input.replace(/_+/g, "_"); // remove duplicate underscores
    console.log("board_name: " + input);

    window.location.href = "/messageboard/" + input;
    e.preventDefault();
    }); 

});
