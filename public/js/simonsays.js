import '../css/simonsays.scss';
import $ from 'jquery';

var audioGreen = new Audio("https://www.soundjay.com/button/beep-01a.mp3");
var audioYellow = new Audio("https://www.soundjay.com/button/beep-02.mp3");
var audioBlue = new Audio("https://www.soundjay.com/button/beep-03.mp3");
var audioRed = new Audio("https://www.soundjay.com/button/beep-04.mp3");

audioGreen.setAttribute("SameSite", "None");
audioYellow.setAttribute("SameSite", "None");
audioBlue.setAttribute("SameSite", "None");
audioRed.setAttribute("SameSite", "None");

var isOn = false; //is device switched on
var isStrict = false; //is strict mode activated
var count = 0; //turn count
var playerMove = 0; //current player move count (range: 0 to count)
var patternArr; //current game color pattern
var sequenceSpeed = 1000; //time between color pattern presses
var winCount = 20; //number of turns before win sequence played
var sequenceInterval; //variable for any interval function
var sequenceTimeout; //variable for any timeout function

$(document).ready(function() {
  
  //add event listeners to color audios so that when audio finishes, revert color background to original
  audioGreen.addEventListener("ended", function(){
    $("#div-item-green").css("background-color", "#004d00");
    audioGreen.currentTime = 0; //resent currentTime variable
  });
  
  audioRed.addEventListener("ended", function(){
    $("#div-item-red").css("background-color", "#990000");
    audioRed.currentTime = 0;
  });
  
  audioBlue.addEventListener("ended", function(){
    $("#div-item-blue").css("background-color", "#094a8f");
    audioBlue.currentTime = 0;
  });
  
  audioYellow.addEventListener("ended", function(){
    $("#div-item-yellow").css("background-color", "#999900");
    audioYellow.currentTime = 0;
  });
   
  $("#div-on-off").click(function(){ //when on/off switch toggled... reset all values and stop any ongoing interval/timeout functions
    if (isOn){ //when switch off from on...
      $("#div-on-off-toggle").css("left", "0px"); //animation
      $("#div-count").html("- -");//reset count display
      $("#div-count").css("color", "black");//hide text of count display
      
      $("#div-strict-led").css("background-color", "black"); //revert strict led background color
      
      $("#div-strict").removeClass("clickable");
      $("#div-start").removeClass("clickable");
      $(".div-item").removeClass("clickable");
      
      isOn = false;
      isStrict = false;
      
      if(sequenceInterval !== undefined){ //end any ongoing inteval functions
        clearInterval(sequenceInterval);
      }
      if(sequenceTimeout !== undefined){ //end any ongoing timeout functions
        clearInterval(sequenceTimeout)
      }
    }
    else{//when switch on from off
      $("#div-on-off-toggle").css("left", "18px"); //animation
      $("#div-count").css("color", "red"); //show count display
      
      $("#div-strict").addClass("clickable");
      $("#div-start").addClass("clickable");
      isOn = true;
    }
  });
  
  $("#div-strict").click(function(){//when strict button clicked
    if($("#div-strict").hasClass("clickable")){
      if(isStrict){//when switched off from on...
      $("#div-strict-led").css("background-color", "black"); //animation
      isStrict = false;
      }
      else{//when switch on from off...
        $("#div-strict-led").css("background-color", "#ff471a"); //animation
        isStrict = true;
      }
    }
  });
  
  $("#div-start").click(function(){ //when start button clicked...
    if($("#div-start").hasClass("clickable")){//if the start button is clickable...
      if(sequenceInterval !== undefined){ //stop interval function if defined
        clearInterval(sequenceInterval);
      }
      if(sequenceTimeout !== undefined){ //stop timeout function if defined
        clearInterval(sequenceTimeout)
      }
      startNewGame();
    }
  });
  
  $(".div-item").mousedown(function(){ //when color item pressed...
    var idPressed = event.target.id; //get id of color item pressed
    var jId = "#" + idPressed; //get jquery id from id
    var colorPressed = getColorFromId(idPressed); //get color from id
    
    if($(jId).hasClass("clickable")){ //if pressed color item is clickable...
      
      if(colorPressed !== patternArr[playerMove]){ //if color pressed is incorrect (does not match current sequence color)...
        pressColor("RED"); //part of incorrect animation
        pressColor("BLUE"); //part of incorrect animation
        pressColor("GREEN"); //part of incorrect animation
        pressColor("YELLOW"); //part of incorrect animation
        $("#div-count").html("! !"); //part of incorrect animation
        
        if(isStrict){ //if strict mode is activated...
          sequenceTimout = setTimeout(function(){ //pause then start new game
            startNewGame();
          }, 1250);
        }
        else{ //if strict mode is not activated...
          cpuGoTurn(false); //repeat last turn without adding to color sequence
        }
        
      }
      else{ //if color pressed is correct (matches current sequence color)
       
        pressColor(colorPressed); //animation
        playerMove++;

        if(playerMove === winCount){ //if end of player turn and at win count...
          winSequence(); //play win animation
        }else if(playerMove === count){ //if end of players turn
          count++;
          sequenceSpeed -= 33;
          cpuGoTurn();    
        }
      }
    }
  });
 
});

function getColorFromId(id){ //get and return a color from the given Id
  switch (id){
    case "div-item-green":
      return "GREEN";
    case "div-item-yellow":
      return "YELLOW";
    case "div-item-blue":
      return "BLUE";
    case "div-item-red":
      return "RED";
  }
}

function setColorsUnclickable(){ //make color item divs unclickable
  $("#div-item-red").removeClass("clickable");
  $("#div-item-blue").removeClass("clickable");
  $("#div-item-green").removeClass("clickable");
  $("#div-item-yellow").removeClass("clickable");
}

function setColorsClickable(){ //make color item divs clickable
  $("#div-item-red").addClass("clickable");
  $("#div-item-blue").addClass("clickable");
  $("#div-item-green").addClass("clickable");
  $("#div-item-yellow").addClass("clickable");
}

function pressColor(color){//perform animation and sound for given color press
  switch(color){
    case "GREEN":
      $("#div-item-green").css("background-color", "#00a74a");
      audioGreen.load();
      audioGreen.play();
      break;
    case "YELLOW":
      $("#div-item-yellow").css("background-color", "#b3b300");
      audioYellow.load();
      audioYellow.play();
      break;
    case "BLUE":
      $("#div-item-blue").css("background-color", "#6666ff");
      audioBlue.load();
      audioBlue.play();
      break;
    case "RED":
      $("#div-item-red").css("background-color", "#ff1a1a");
      audioRed.load();
      audioRed.play();
      break;
  }
}

function playSequence(colorArray, sequenceSpeed){//play a given color sequence at a given speed
  var i = 0; //index
  
  //perform first cycle before waiting
  var curColor = colorArray[i++]; //first color, i is incremented afterward
  pressColor(curColor);
  if(colorArray.length === 1){//if only one color in array, end here.
    setColorsClickable();
    return;
  }
  sequenceInterval = setInterval(function(){//press a color every interval
    curColor = colorArray[i++]; //cur color, i is incremented aftward
    pressColor(curColor);
    
    if (i === colorArray.length){//if the pressed color was the last one in array, stop interval and end.
      setColorsClickable();
      clearInterval(sequenceInterval);
    }
  }, sequenceSpeed);     
}

function getRandomColor(){ //get and return a random color
  var randNum = Math.floor(Math.random() * 4); //random value 0-3
  switch (randNum){
    case 0:
      return "GREEN";
    case 1:
      return "YELLOW";
    case 2:
      return "BLUE";
    case 3:
      return "RED";
  }
}

function cpuGoTurn(addToPattern){ // similuate the cpu's turn, if false: don't add to patternArr (default is true)
  setColorsUnclickable();
  playerMove = 0; //reset player move count
  
  if(addToPattern!== false){ //add new color to pattern array unless input is false
    patternArr.push(getRandomColor());
  }
  
  sequenceTimeout = setTimeout(function(){ //pause before playing the pattern sequence
    $("#div-count").html(count); //update count display
    playSequence(patternArr, sequenceSpeed); //play current sequence
  }, 2000);
}

function startNewGame(){ //reset values and set up new game
  patternArr = [];
  count = 0;
  $("#div-count").html(count++); 
  cpuGoTurn();
}

function winSequence(){ //action taken when player reaches win count and wins the game
  setColorsUnclickable();
  var winSeqSpeed = 200;
  var winPattern = ["GREEN", "RED", "BLUE", "YELLOW",
                    "GREEN", "RED", "BLUE", "YELLOW",
                   "GREEN", "RED", "BLUE", "YELLOW",
                   "GREEN", "RED", "BLUE", "YELLOW",
                   "GREEN", "RED", "BLUE", "YELLOW",
                   "GREEN", "RED", "BLUE", "YELLOW",
                   "GREEN", "RED", "BLUE", "YELLOW",
                   "GREEN", "RED", "BLUE", "YELLOW",
                   "GREEN", "RED", "BLUE", "YELLOW",
                   "GREEN", "RED", "BLUE", "YELLOW",
                   "GREEN", "RED", "BLUE", "YELLOW"];
  $("#div-count").html("* *");
  playSequence(winPattern, winSeqSpeed);
  sequenceTimeout = setTimeout(function(){ //pause a sec before starting a new game
    console.log("starting new game");
    startNewGame();
  }, winSeqSpeed*winPattern.length + 1000);
}