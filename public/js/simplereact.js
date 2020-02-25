import '../css/simplereact.scss'
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { SimpleReactComp } from '../js/components/simplereactcomp';

/*class MyComponent extends React.Component {
  render() {
    //return <ReactBootstrap.Alert variant='primary'>This is a test</ReactBootstrap.Alert>;
    return (
      <ReactBootstrap.Modal show={true} onHide={null}>
        <ReactBootstrap.Modal.Header closeButton>
          <ReactBootstrap.Modal.Title>Modal heading</ReactBootstrap.Modal.Title>
        </ReactBootstrap.Modal.Header>
        <ReactBootstrap.Modal.Body>Woohoo, you're reading this text in a modal!</ReactBootstrap.Modal.Body>
        <ReactBootstrap.Modal.Footer>
          <ReactBootstrap.Button variant="secondary" onClick={null}>
            Close
          </ReactBootstrap.Button>
          <ReactBootstrap.Button variant="primary" onClick={null}>
            Save Changes
          </ReactBootstrap.Button>
        </ReactBootstrap.Modal.Footer>
      </ReactBootstrap.Modal>
    );
  }
}*/

// class Test extends React.Component {
//   render(){
//     return (
//       <div>
//         <h2>Alex!!</h2>
//         <SimpleReactComp/>
//       </div>
//     );
//   }
// }

function Test (props) {
  return (
    <div>
      <h2>Alex!</h2>
      <SimpleReactComp/>
    </div>
  )
}



ReactDOM.render(<Test/>, document.getElementById("root"));

