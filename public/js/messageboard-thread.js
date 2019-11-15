import '../css/messageboard.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { Thread } from '../js/components/thread';

$(document).ready(function() {
  var currentURL = window.location.pathname;
  currentURL = currentURL.split("/");
  var thread_id = currentURL[3];

  $("#threadTitle").text(window.location.pathname);
  
  class MyComponent extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        data: null,
        error: null
      }
      this.deleteThreadAction = this.deleteThreadAction.bind(this);
    }

    componentDidMount() {
      fetch("/messageboard/api/replies/" + thread_id)
        .then(res => res.json())
        .then(
          (result) => {
            console.log("fetch result", result);
            this.setState({
              data: result
            });
          },
          (error) => {
            this.setState({error});
          }
        );
    }

    deleteThreadAction() {
      window.location.href = "/messageboard/" + this.state.data.board;
    }

    render(){
      let thread;
      if(this.state.data){
        thread = (<Thread _id={this.state.data._id}
                        board={this.state.data.board}
                        text={this.state.data.text}
                        created_on={this.state.data.created_on}
                        replies={this.state.data.replies}
                        deleteThreadAction={this.deleteThreadAction}
                />);
      } else if(this.state.error){
        thread = <div>Thread not found</div>;
      }

      return (
        <div>
          <h1 id="threadTitle">{window.location.pathname}</h1>
          <br></br>
          {thread}
        </div> 
      );
    }
  }

  ReactDOM.render(<MyComponent/>, document.getElementById('thread-display'));

});
