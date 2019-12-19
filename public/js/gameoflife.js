import '../css/gameoflife.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

const NUM_CELLS_HEIGHT_SMALL = 30;
const NUM_CELLS_WIDTH_SMALL = 50;
const NUM_CELLS_HEIGHT_MEDIUM = 50;
const NUM_CELLS_WIDTH_MEDIUM = 70;
const NUM_CELLS_HEIGHT_LARGE = 60;
const NUM_CELLS_WIDTH_LARGE = 75;

var secondAppColor = "#373538";

const cellColors = { //mappings for status to color
  dead: "black",
  alive: "green",
  new: "lightgreen"
};

class Cell extends React.Component { //react object for each individual cell on the board
 
  render() { 
    return (
      <div
        key = {this.props.id} 
        id = {this.props.id}
        className = {"cell " + "cell-" + this.props.size}
        style = {{backgroundColor: cellColors[this.props.state]}}
        onClick = {this.props.onClick}>
      </div>
    );
  }
}

class CellBoard extends React.Component{ //react object for board of cells

  render(){
    var board = this.props.board;
    var numHeight = board.length; //number of cells per column
    var numWidth = board[0].length; //number of cells per row
    var size;
    switch(numWidth){ //use num cells along width to determine board size
      case NUM_CELLS_WIDTH_SMALL:
        size = "small";
        break;
      case NUM_CELLS_WIDTH_MEDIUM:
        size = "medium";
        break;
      case NUM_CELLS_WIDTH_LARGE:
        size = "large";
        break;
                   }
    var cells = []; //array of cell objects
    for(var curCol = 0; curCol<numHeight; curCol++){ //cycle through each cell in board array and create a cell object
        for(var curRow = 0; curRow<numWidth; curRow++){
          var curCellValue = board[curCol][curRow];
          var curCellState;
          switch (curCellValue){ //map cell state int value to string value
            case 0:
              curCellState = "dead";
              break;
            case 1:
              curCellState = "new";
              break;
            case 2:
              curCellState = "alive";
              break;
          }
          cells.push(//create Cell object and push into array
            <Cell
              key = {"cell-" + curCol + "-" + curRow}
              id = {"cell-" + curCol + "-" + curRow}
              state = {curCellState}
              size = {size}
              onClick = {this.props.onCellClick}/>
          );
        }
    }
    //console.log("cells:", cells);
    return (
      <div id="div-board" className={"board-"+size}>
        <div id = "div-cells" className={"grid-"+size}>
          {cells}
        </div>
      </div>
    );
  }
}

class OptionButton extends React.Component{ //react object for each option button
  
  render(){
     var style = {
      backgroundColor: secondAppColor,
      color: "white",
      border: "2px solid white",
      borderRadius: "5px",
      cursor: "pointer"
    };
    
    if (this.props.position == "top"){
      style.fontSize = "17px";
      style.width = "95px";
    } else if (this.props.position == "bottom"){
      style.fontSize = "16px";
      style.width = "135px";
    }

    if(this.props.isSelected){
      style.backgroundColor = "white";
      style.color = secondAppColor;
      style.border = "2px solid " + secondAppColor;
      style.outline = 0;
    }
      
    return (
      <button  
        onClick={this.props.onClick} style={style}>
          {this.props.children}
      </button>
    );
  }
}

 
var timer = null; //used to store setInterval object

const boardSize = { //maps board size to related props
  small: {numHeight: NUM_CELLS_HEIGHT_SMALL, numWidth: NUM_CELLS_WIDTH_SMALL},
  medium: {numHeight: NUM_CELLS_HEIGHT_MEDIUM, numWidth: NUM_CELLS_WIDTH_MEDIUM},
  large: {numHeight: NUM_CELLS_HEIGHT_LARGE, numWidth: NUM_CELLS_WIDTH_LARGE}
};
  
const speedType = { //maps spead to milliseconds per interval
  slow: 400, medium: 200, fast: 100
};
  
class GameApp extends React.Component{ //react object for each individual row in list/table  
  
  constructor(props){
    super(props);
    var defaultSize = "medium";
    this.state = {
      size: defaultSize, //small, medium, fast
      speed: "medium", //slow, medium, fast
      status: "run", //run, pause, clear, or standby
      generation: 0, //current interval
      board: this.createBoard(defaultSize)
    };
    this.clearBoard         = this.clearBoard.bind(this);
    this.intervalAction     = this.intervalAction.bind(this);
    this.runApp             = this.runApp.bind(this);
    this.btnRunOnClick      = this.btnRunOnClick.bind(this);
    this.btnPauseOnClick    = this.btnPauseOnClick.bind(this);
    this.timeoutAction      = this.timeoutAction.bind(this);
    this.btnClearOnClick    = this.btnClearOnClick.bind(this);
    this.btnSizeHandler     = this.btnSizeHandler.bind(this);
    this.btnSmallOnClick    = this.btnSmallOnClick.bind(this);
    this.btnMedOnClick      = this.btnMedOnClick.bind(this);
    this.btnLargeOnClick    = this.btnLargeOnClick.bind(this);
    this.btnSpeedHandler    = this.btnSpeedHandler.bind(this);
    this.btnSlowOnClick     = this.btnSlowOnClick.bind(this);
    this.btnMedSpOnClick    = this.btnMedSpOnClick.bind(this);
    this.btnFastOnClick     = this.btnFastOnClick.bind(this);
    this.onCellClickHandler = this.onCellClickHandler.bind(this);
  }
  
  createBoard(size){ //creates board of given size with random values and returns the board object array
    var numWidth = boardSize[size].numWidth;
    var numHeight = boardSize[size].numHeight;
    
    var board = new Array(numHeight);  
    for (var col = 0; col < numHeight ; col++){
      board[col] = new Array(numWidth);
      for (var row = 0; row < numWidth; row++){
        var newVal = Math.floor(Math.random() * 1.35); //1.35 allows for more dead cells than alive cells
        if(newVal>=1){ //since above line only returns either 0 or 1, must convert 1's to 2's
          newVal = 2;
        }
        board[col][row] = newVal;
      }
    }
    //console.log("new board:", board);
    return board;
  }
  
  clearBoard() { //updates all cells/values in board state to have 0 value
    var board = this.state.board;
    var size = this.state.size;
    var sizeObj = boardSize[size];
    for(var curCol = 0; curCol<sizeObj.numHeight; curCol++){
      for(var curRow = 0; curRow<sizeObj.numWidth; curRow++){
        board[curCol][curRow] = 0;
      }
    }
    this.setState({board: board});
  }
  
  intervalAction() {//during each interval, increment generation value, and update board
    var board = this.state.board;
    var numWidth = boardSize[this.state.size].numWidth;
    var numHeight = boardSize[this.state.size].numHeight;
    var newBoard = new Array(numHeight);
    //for each cell, count non-dead neighbors and set value of cell accordingly
    for (var col = 0; col < numHeight ; col++){
      newBoard[col] = new Array(numWidth);
      for (var row = 0; row < numWidth; row++){
        
        //count neighboring cells (up to eight)
        var neighborCount = 0; //count of neighboring cells with value > 0
        
        //first check special cases that have less than 8 neighboring cells
        if(col==0){ 
          if(row==0){ //top-left corner: 3 neighboring cells
            if(board[0][1]>0){neighborCount++;}
            if(board[1][1]>0){neighborCount++;}
            if(board[1][0]>0){neighborCount++;}
          } else if(row==numWidth-1){ //top-right corner: 3 neighboring cells
            if(board[0][row-1]>0){neighborCount++;}
            if(board[1][row-1]>0){neighborCount++;}
            if(board[1][row]>0){neighborCount++;}
          } else{ //top-side: 5 neighboring cells
            if(board[col][row-1]>0){neighborCount++;}
            if(board[col][row+1]>0){neighborCount++;}
            if(board[col+1][row-1]>0){neighborCount++;}
            if(board[col+1][row]>0){neighborCount++;}
            if(board[col+1][row+1]>0){neighborCount++;}
          }  
        } else if(col==numHeight-1){
          if(row==0){ //bot-left corner: 3 neighboring cells
            if(board[col-1][0]>0){neighborCount++;}
            if(board[col-1][1]>0){neighborCount++;}
            if(board[col][1]>0){neighborCount++;}
          } else if(row==numWidth-1){ //bot-right corner: 3 neighboring cells
            if(board[col][row-1]>0){neighborCount++;}
            if(board[col-1][row-1]>0){neighborCount++;}
            if(board[col-1][row]>0){neighborCount++;}
          } else{ //bot-side: 5 neighboring cells
            if(board[col-1][row-1]>0){neighborCount++;}
            if(board[col-1][row]>0){neighborCount++;}
            if(board[col-1][row+1]>0){neighborCount++;}
            if(board[col][row-1]>0){neighborCount++;}
            if(board[col][row+1]>0){neighborCount++;}
          }
        } else if(row==0){ //left-side: 5 neighboring cells
          if(board[col-1][row]>0){neighborCount++;}
          if(board[col-1][row+1]>0){neighborCount++;}
          if(board[col][row+1]>0){neighborCount++;}
          if(board[col+1][row]>0){neighborCount++;}
          if(board[col+1][row+1]>0){neighborCount++;}
        } else if(row==numWidth-1){ //right-side: 5 neighboring cells
          if(board[col-1][row-1]>0){neighborCount++;}
          if(board[col-1][row]>0){neighborCount++;}
          if(board[col][row-1]>0){neighborCount++;}
          if(board[col+1][row-1]>0){neighborCount++;}
          if(board[col+1][row]>0){neighborCount++;}
        } else{ //inside cells: 8 neighboring cells
          if(board[col-1][row-1]>0){neighborCount++;}
          if(board[col-1][row]>0){neighborCount++;}
          if(board[col-1][row+1]>0){neighborCount++;}
          if(board[col][row-1]>0){neighborCount++;}
          if(board[col][row+1]>0){neighborCount++;}
          if(board[col+1][row-1]>0){neighborCount++;}
          if(board[col+1][row]>0){neighborCount++;}
          if(board[col+1][row+1]>0){neighborCount++;}
        }
        var cellVal = board[col][row];
        //using rules of gameoflife change value of cell based on number of non-dead neighbors
        if (cellVal==0){
          if(neighborCount ==3){
            newBoard[col][row] = 1;
          }else{
            newBoard[col][row] = 0;
          }
        } else { //if cell is new or alive
          if(neighborCount == 2 || neighborCount ==3){
            newBoard[col][row] = 2;
          } else{
            newBoard[col][row] = 0;
          }
        }
      }
    }
    
    var curGen = this.state.generation;
    this.setState({board:newBoard, generation: ++curGen}); //increment generation state value
  }
  
  runApp(speed) { //starts interval with given speed
    timer = setInterval(this.intervalAction, speedType[speed]);
  }
  
  btnRunOnClick() { //change status to run if not already and start timerInterval
    if(this.state.status != "run"){
      this.setState({status:"run"});
      this.runApp(this.state.speed);
    }
  }
  
  btnPauseOnClick() {//change status to pause if not already and stop timer if it is running
    if(this.state.status != "pause"){
      this.setState({status:"pause"});
      if(this.state.status == "run"){
        clearInterval(timer);
      }
    }
  }
  
  timeoutAction() { //function needs to be here so that I can access the 'this' object
    this.setState({status:"standby"}); //want to change to standby so clear button doesn't continously show as selected  
  }
  
  btnClearOnClick() { //set status to clear then to standy and clear the board
    this.setState({status:"clear", generation:0});
    setTimeout(this.timeoutAction, 1000); //wait 1 second then set status to standby
    this.clearBoard();
    if(this.state.status == "run"){ //stop timer if it is runniing
      clearInterval(timer);
    }
  }
  
  btnSizeHandler(size) {
    if(this.state.size != size){
      this.setState({
        board: this.createBoard(size),
        size: size,
        generation: 0,
        status: "run"});
      clearInterval(timer);
      this.runApp(this.state.speed);
    }
  }
  
  btnSmallOnClick() {this.btnSizeHandler("small");}
  btnMedOnClick() {this.btnSizeHandler("medium");}
  btnLargeOnClick() {this.btnSizeHandler("large");}
  
  btnSpeedHandler(speed) {
    if(this.state.speed !=speed){
      this.setState({speed:speed});
      if(this.state.status == "run"){
        clearInterval(timer);
        this.runApp(speed);
      }
    }
  }
  
  btnSlowOnClick() {this.btnSpeedHandler("slow");}
  btnMedSpOnClick() {this.btnSpeedHandler("medium");}
  btnFastOnClick() {this.btnSpeedHandler("fast");}
  
  onCellClickHandler(e) { //on cell click, change to either dead or new based on current value, then update board
    var id = e.target.id;
    var strSplit = id.split('-');
    var col = strSplit[1];
    var row = strSplit[2];
    var board = this.state.board;
    var celVal = board[col][row];
    
    switch (celVal){//if dead, change to new; if new or alive, change to dead
      case 0:
        board[col][row] = 1;
        break;
      case 1:
      case 2:
        board[col][row] = 0;
        break;
    }
    this.setState({board:board}); //update board state
  }
  componentDidMount() {//at start start the timer
    this.runApp(this.state.speed);
  }
  
  componentWillUnmount() {//at end stop the timer
    clearInterval(timer);
  }
  
  render() { 
    return (
      <div>
        <div id="div-top-option">
          <OptionButton 
            id="btnRun"
            position="top"
            isSelected={this.state.status == "run"}
            onClick={this.btnRunOnClick}>
              Run
          </OptionButton>
          <OptionButton 
            id="btnPause"
            position="top"
            isSelected={this.state.status == "pause"}
            onClick={this.btnPauseOnClick}>
              Pause
          </OptionButton>
          <OptionButton 
            id="btnClear"
            position="top"
            className="btn-top-option"
            isSelected={this.state.status == "clear"}
            onClick={this.btnClearOnClick}>
              Clear</OptionButton>
          <p id="generation">{"Generation: " + this.state.generation}</p>
        </div>
        
        <CellBoard board={this.state.board} onCellClick={this.onCellClickHandler}/>
        
        <div id="div-bottom-option">
          <div className="bot-op-row" id="div-bot-op-top-row">
            <p className="bot-op-text">Board Size:</p>
            <OptionButton 
              id="btnSmall" 
              position = {"bottom"}
              isSelected={this.state.size == "small"}
              onClick={this.btnSmallOnClick}>
                Size: {NUM_CELLS_WIDTH_SMALL}x{NUM_CELLS_HEIGHT_SMALL}
            </OptionButton>
            <OptionButton 
              id="btnMed" 
              position = {"bottom"}
              isSelected={this.state.size == "medium"}
              onClick={this.btnMedOnClick}>
                Size: {NUM_CELLS_WIDTH_MEDIUM}x{NUM_CELLS_HEIGHT_MEDIUM}
            </OptionButton>
            <OptionButton 
              id="btnLarge" 
              position = {"bottom"}
              isSelected={this.state.size == "large"}
              onClick={this.btnLargeOnClick}>
                Size: {NUM_CELLS_WIDTH_LARGE}x{NUM_CELLS_HEIGHT_LARGE}
            </OptionButton>
          </div>
          <div className="bot-op-row" id="div-bot-op-bot-row">
            <div className="bot-op-row" id="div-bot-op-top-row">
              <p className="bot-op-text">Sim Speed:</p>
              <OptionButton 
                id="btnSlow" 
                position = {"bottom"}
                isSelected={this.state.speed == "slow"}
                onClick={this.btnSlowOnClick}>
                  Slow
              </OptionButton>
              <OptionButton 
                id="btnMedSp" 
                position = {"bottom"}
                isSelected={this.state.speed == "medium"}
                onClick={this.btnMedSpOnClick}>
                  Medium
              </OptionButton>
              <OptionButton 
                id="btnFast" 
                position = {"bottom"}
                isSelected={this.state.speed == "fast"} 
                onClick={this.btnFastOnClick}>
                  Fast
              </OptionButton>
            </div>
          </div>
        </div>
        <div id="div-disclaimer">
          Feel free to add cells while it's running. The cells in light green are younger, green are older.
        </div>
      </div>
    );
  }
}
$('document').ready(function() {
  ReactDOM.render(<GameApp/>, document.getElementById('app'));
});

