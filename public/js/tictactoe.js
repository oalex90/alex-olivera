/*

Board Array Pos
[0 1 2]
[3 4 5]
[6 7 8]

*/
import '../css/serverapps.scss';
import '../css/tictactoe.scss';
import $ from 'jquery';

var indexes = {X:[], O:[]}; //indexes of marks (X or O) currently on the board
var cpuXorO; // "X" or "O" depending on what cpu is
var playerXorO; // "X" or "O" depending on what player is
var loses = 0; // player loses
var ties = 0; // player ties
var turn; // game turn (0-10)
var game = 0; // game number

$(document).ready(function() {
  
  //$("h1").addClass("animated bounce");
  //initial
  $("#div-score").hide();
  $("#div-result").hide();
  
  $("#div-result").click(function(){
    $("#div-result").hide();
    $("#div-score").show();
    newGame();
  });
  
  //if clickable space clicked
  $("#div-main").on("click", ".clickable", function(){
    var idPressed = event.target.id; //get id of square pressed
    if(game > 0){ //if this isn't the first game, continue as normal.
      var posPressed = getPosFromId(idPressed); //convert id of square pressed to index number
      placeOnBoard(playerXorO, posPressed); // place player move on board  
      
      switch(turn){ //perform logic based on turn number; odd turn# = cpu goes first, even turn# = cpu goes second 
          
        case 2: //cpu goes second (first turn)
          switch(posPressed){ //perform logic based on player move
            case 4:
              placeOnBoard(cpuXorO, 0);
              break;
            default:
              placeOnBoard(cpuXorO, 4);
          }
          break;
          
        case 3: // cpu goes first (second turn)
          switch(posPressed){ // perform logic based on player move
            case 0:
            case 1:
            case 3:
              placeOnBoard (cpuXorO, 8);
              break;
            case 2:
            case 5:
              placeOnBoard (cpuXorO, 6);
              break;
            case 6:
            case 7:
              placeOnBoard (cpuXorO, 2);
              break;
            case 8:
              placeOnBoard (cpuXorO, 0);
              break;
          }
          break;
          
        case 4: //cpu goes second (second turn)
          if(isAtPos(playerXorO, 1) && isAtPos(playerXorO, 3) ||
             isAtPos(playerXorO, 1) && isAtPos(playerXorO, 6) ||
             isAtPos(playerXorO, 2) && isAtPos(playerXorO, 3) ||
             isAtPos(playerXorO, 3) && isAtPos(playerXorO, 8)){
            placeOnBoard(cpuXorO, 0);

          } else if (isAtPos(playerXorO, 3) && isAtPos(playerXorO, 7) ||
                     isAtPos(playerXorO, 0) && isAtPos(playerXorO, 7) ||
                     isAtPos(playerXorO, 4) && isAtPos(playerXorO, 8)){
            placeOnBoard(cpuXorO, 6);

          } else if (isAtPos(playerXorO, 1) && isAtPos(playerXorO, 5) ||
                     isAtPos(playerXorO, 0) && isAtPos(playerXorO, 5)){
            placeOnBoard(cpuXorO, 2);

          } else if (isAtPos(playerXorO, 5) && isAtPos(playerXorO, 7) ||
                     isAtPos(playerXorO, 4) && isAtPos(playerXorO, 6) ||
                     isAtPos(playerXorO, 2) && isAtPos(playerXorO, 7)){
            placeOnBoard(cpuXorO, 8);

          } else if (isAtPos(playerXorO, 0) && isAtPos(playerXorO, 8) ||
                     isAtPos(playerXorO, 1) && isAtPos(playerXorO, 8) ||
                     isAtPos(playerXorO, 2) && isAtPos(playerXorO, 6)){
            placeOnBoard(cpuXorO, 3);

          } else{
            moveDefault();
          }
          break;
          
        case 5:
        case 6:
        case 7:
        case 8:
          moveDefault();
          break;
          
        case 9: //cpu goes first (last turn). cpu will place last mark on board. Will result in either a loss for the player or a draw
          var cpuWinOptions = findCheckMate(cpuXorO); //get win options for cpu
          placeOnBoard(cpuXorO, getRandomOpenSquare()); //place X on last remaining square.
          if (cpuWinOptions.length === 0){ //if no win options found -> tie
            endGame("Tie");
          } else { //if win option found -> cpu wins, player loses
            endGame("Lose");
          }
          break;
         
        case 10: //cpu goes second (after last turn). if turn 10 is reached, will always be a tie.
          endGame("Tie");
          break;
      }
    } 
    else{ // turn === 0 -> initial startup
      $("#text-tagline").hide();
      $("#div-score").show();; // display score
      
      if(idPressed === "div-bot-center-sqr"){ //if O square is selected
        cpuXorO = "X";
        playerXorO = "O";
      } else{ // if X square is selected
        cpuXorO = "O";
        playerXorO = "X";
      }
      newGame();
    }
  });
  
});

function findCheckMate (XorO){ //for given letter (X or O) find and return first found instance of two squares in a row and an empty spot to make three in a way
  var other; //other letter
 
  if(XorO === "X"){
    other = "O";
  } else{
    other = "X";
  }
  
  //check all possible two in a row options and return the first one found
  if(isAtPos(XorO, 1) && isAtPos(XorO, 2) && !isAtPos(other, 0)){
    return [0, 1, 2];
  } else if(isAtPos(XorO, 0) && isAtPos(XorO, 2) && !isAtPos(other, 1)){
    return [1, 0, 2];
  } else if(isAtPos(XorO, 0) && isAtPos(XorO, 1) && !isAtPos(other, 2)){
    return [2, 0, 1];
  } else if(isAtPos(XorO, 4) && isAtPos(XorO, 5) && !isAtPos(other, 3)){
    return [3, 4, 5];
  } else if(isAtPos(XorO, 3) && isAtPos(XorO, 5) && !isAtPos(other, 4)){
    return [4, 3, 5];
  } else if(isAtPos(XorO, 3) && isAtPos(XorO, 4) && !isAtPos(other, 5)){
    return [5, 3, 4];
  } else if(isAtPos(XorO, 7) && isAtPos(XorO, 8) && !isAtPos(other, 6)){
    return [6, 7, 8];
  } else if(isAtPos(XorO, 6) && isAtPos(XorO, 8) && !isAtPos(other, 7)){
    return [7, 6, 8];
  } else if(isAtPos(XorO, 6) && isAtPos(XorO, 7) && !isAtPos(other, 8)){
    return [8, 6, 7];
  } else if(isAtPos(XorO, 3) && isAtPos(XorO, 6) && !isAtPos(other, 0)){
    return [0, 3, 6];
  } else if(isAtPos(XorO, 0) && isAtPos(XorO, 6) && !isAtPos(other, 3)){
    return [3, 0, 6];
  } else if(isAtPos(XorO, 0) && isAtPos(XorO, 3) && !isAtPos(other, 6)){
    return [6, 0, 3];
  } else if(isAtPos(XorO, 4) && isAtPos(XorO, 7) && !isAtPos(other, 1)){
    return [1, 4, 7];
  } else if(isAtPos(XorO, 1) && isAtPos(XorO, 7) && !isAtPos(other, 4)){
    return [4, 1, 7];
  } else if(isAtPos(XorO, 1) && isAtPos(XorO, 4) && !isAtPos(other, 7)){
    return [7, 1, 4];
  } else if(isAtPos(XorO, 5) && isAtPos(XorO, 8) && !isAtPos(other, 2)){
    return [2, 5, 8];
  } else if(isAtPos(XorO, 2) && isAtPos(XorO, 8) && !isAtPos(other, 5)){
    return [5, 2, 8];
  } else if(isAtPos(XorO, 2) && isAtPos(XorO, 5) && !isAtPos(other, 8)){
    return [8, 2, 5];
  } else if(isAtPos(XorO, 4) && isAtPos(XorO, 8) && !isAtPos(other, 0)){
    return [0, 4, 8];
  } else if(isAtPos(XorO, 0) && isAtPos(XorO, 8) && !isAtPos(other, 4)){
    return [4, 0, 8];
  } else if(isAtPos(XorO, 0) && isAtPos(XorO, 4) && !isAtPos(other, 8)){
    return [8, 0, 4];
  } else if(isAtPos(XorO, 4) && isAtPos(XorO, 6) && !isAtPos(other, 2)){
    return [2, 4, 6];
  } else if(isAtPos(XorO, 2) && isAtPos(XorO, 6) && !isAtPos(other, 4)){
    return [4, 2, 6];
  } else if(isAtPos(XorO, 2) && isAtPos(XorO, 4) && !isAtPos(other, 6)){
    return [6, 2, 4];
  }
  return []; //return empty array if none found (no win/check-mate possible)
}

function moveDefault(){ //for cpu, look for win moves. If none found, look for possible block moves. If none found, go in a random empty square.
  let resultCpu = findCheckMate(cpuXorO); //get win move
  let resultPlayer = findCheckMate(playerXorO); // get block move
  if(resultCpu.length >0){ //win move found -> CPU Wins
    placeOnBoard(cpuXorO, resultCpu[0]);
    loses++;
    freezeBoard();
    highlightSquares(resultCpu);
    $("#text-loses").html(loses);
    $("#text-result").html("You Lose!");
    $("#div-score").hide();
    $("#div-result").show();
  }
  else if(resultPlayer.length >0){ // no win move found, but block move found
    placeOnBoard(cpuXorO, resultPlayer[0]);
  } else{ // no win or block move found, so place on random square
    placeOnBoard(cpuXorO, getRandomOpenSquare());
  }
}

function placeOnBoard(XorO, pos){ // put either X or O on given square on the board
  var id = getIdFromPos(pos); //get ID
  var jId = "#"+id; //get jQuerry id call
  $(jId).html(XorO); //put letter on square
  if(XorO ==="X"){ //if letter is X, make color red
    $(jId).css("color","red");
  } else{ //if letter is O, make color blue
    $(jId).css("color","blue");
  }
  $(jId).removeClass("clickable"); //make unclickable 
  indexes[XorO].push(pos);
  turn++;  
  
  console.log("turn: ", turn);
}

function getRandomOpenSquare(){ //find all open/available squares and return random one.
  var openSquares = []; //array of open/available squares
  for(var i=0; i<9; i++){ //cycle through every square and see if it is free
    if(!isAtPos("X", i) && !isAtPos("O", i)){
      openSquares.push(i);
    }
  }
  return openSquares[Math.floor(Math.random()*openSquares.length)]; //return random index from array
}

function getPosFromId(id){ //convert square postion index to square id
  switch(id){
    case "div-top-left-sqr":
      return 0;
    case "div-top-center-sqr":
      return 1;
    case "div-top-right-sqr":
      return 2;
    case "div-mid-left-sqr":
      return 3;
    case "div-mid-center-sqr":
      return 4;
    case "div-mid-right-sqr":
      return 5;
    case "div-bot-left-sqr":
      return 6;
    case "div-bot-center-sqr":
      return 7;
    case "div-bot-right-sqr":
      return 8;
  }
}

function getIdFromPos(position){ //convert square id to square position index
  switch(position){
    case 0:
      return "div-top-left-sqr";
    case 1:
      return "div-top-center-sqr";
    case 2:
      return "div-top-right-sqr";
    case 3:
      return "div-mid-left-sqr";
    case 4:
      return "div-mid-center-sqr";
    case 5:
      return "div-mid-right-sqr";
    case 6:
      return "div-bot-left-sqr";
    case 7:
      return "div-bot-center-sqr";
    case 8:
      return "div-bot-right-sqr";   
  }
}
  
function isAtPos(XorO, position){ //use indexes variable to determine if given letter is at a give index position
  return indexes[XorO].indexOf(position) >= 0;
}

function endGame(result){//result can be "Lose" or "Tie"
    
  if(result ==="Lose"){ //if lose, freezeBoard, highlight losing squres, change result message to "You Lose", and update lose counter
    loses++;
    freezeBoard();
    highlightSquares(resultCpu);
    $("#text-loses").html(loses);
    $("#text-result").html("You Lose!");
  } else{ //if tie, change result message to "Tie Game", and update tie counter
    ties++;
    $("#text-ties").html(ties);
    $("#text-result").html("Tie Game!");
  }
   
  $("#div-score").hide(); //hide score section
  $("#div-result").show(); //show result and new game button
}

function newGame(){ //reset board, switch assigned letters (e.g. cpu:X, player: O -> cpu:O, player:X), and make first move if cpu is "X"
  
  resetBoard();
  game++;
  
  if(game % 2 === 0){ //if cpu is X, make first move (always in center square)
    placeOnBoard(cpuXorO, 4);
  }  
}

function freezeBoard(){//make all squares unclickable
  $("#div-top-left-sqr").removeClass("clickable");
  $("#div-top-center-sqr").removeClass("clickable");
  $("#div-top-right-sqr").removeClass("clickable");
  $("#div-mid-left-sqr").removeClass("clickable");
  $("#div-mid-center-sqr").removeClass("clickable");
  $("#div-mid-right-sqr").removeClass("clickable");
  $("#div-bot-left-sqr").removeClass("clickable");
  $("#div-bot-center-sqr").removeClass("clickable");
  $("#div-bot-right-sqr").removeClass("clickable");
}

function highlightSquares(arr){//highlight the squares using the given index array
  var currJId;
  for(var j=0; j<arr.length; j++){
    currJId = "#" + getIdFromPos(arr[j]);
    
    $(currJId).css("background-color", "#b39800");
    $(currJId).css("text-shadow","-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black");
  }
}

function resetBoard(){ //make all squares blank, and reset varibles
  $("#div-top-left-sqr").html("");
  $("#div-top-left-sqr").removeAttr("style");
  $("#div-top-left-sqr").addClass("clickable");
  $("#div-top-center-sqr").html("");
  $("#div-top-center-sqr").removeAttr("style");
  $("#div-top-center-sqr").addClass("clickable");
  $("#div-top-right-sqr").html("");
  $("#div-top-right-sqr").removeAttr("style");
  $("#div-top-right-sqr").addClass("clickable");
  $("#div-mid-left-sqr").html("");
  $("#div-mid-left-sqr").removeAttr("style");
  $("#div-mid-left-sqr").addClass("clickable");
  $("#div-mid-center-sqr").html("");
  $("#div-mid-center-sqr").removeAttr("style");
  $("#div-mid-center-sqr").addClass("clickable");
  $("#div-mid-right-sqr").html("");
  $("#div-mid-right-sqr").removeAttr("style");
  $("#div-mid-right-sqr").addClass("clickable");
  $("#div-bot-left-sqr").html("");
  $("#div-bot-left-sqr").removeAttr("style");
  $("#div-bot-left-sqr").addClass("clickable");
  $("#div-bot-center-sqr").html("");
  $("#div-bot-center-sqr").removeAttr("style");
  $("#div-bot-center-sqr").addClass("clickable");
  $("#div-bot-right-sqr").html("");
  $("#div-bot-right-sqr").removeAttr("style");
  $("#div-bot-right-sqr").addClass("clickable");
  
  indexes = {X:[], O:[]};
  turn = 1; //reset to 1 instead of 0 beacsue game has already been initialized
}