class MyComponent extends React.Component {
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
}

ReactDOM.render(<MyComponent></MyComponent>, document.getElementById("root"));
