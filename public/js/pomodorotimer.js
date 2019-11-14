import '../css/pomodorotimer.scss';
import $ from 'jquery';

$(document).ready(function() {

  // break '-' button pressed: if timer is off, decrease value by one if value is > 0. Change secondsLeft if type is break
  $("#break-decrement").click(function(){
    if(!isTimerOn && breakMin>1){
      breakMin--;
      updateBreakMin();
      if(isOnBreak){
        secondsLeft= breakMin * 60;
        $("#time-left").text(breakMin);
      }
    }                  
  });
  
  // break '+' button pressed: if timer is off, increase value by one if value is < 1000. Change secondsLeft if type is break
  $("#break-increment").click(function(){
    if(!isTimerOn && breakMin<60){
      breakMin++;
      updateBreakMin();
      if(isOnBreak){
        secondsLeft= breakMin * 60;
        $("#time-left").text(breakMin);
      }
    }            
  });
  
  // session '-' button pressed: if timer is off, decrease value by one if value is > 0. Change secondsLeft if type is session
  $("#session-decrement").click(function(){
    if(!isTimerOn && sessionMin>1){
      sessionMin--;
      updateSessionMin();
      if(!isOnBreak){
        secondsLeft= sessionMin * 60;
        $("#time-left").text(sessionMin + ":00");
      }
    }                
  });
  
  // session '+' button pressed: if timer is off, increase value by one if value is < 1000. Change secondsLeft if type is session
  $("#session-increment").click(function(){
    if(!isTimerOn && sessionMin<60){
      sessionMin++;
      updateSessionMin();
      if(!isOnBreak){
        secondsLeft= sessionMin * 60;
        $("#time-left").text(sessionMin + ":00");
      }
    }                   
  });
  
  $("#reset").click(function(){
    $("#beep").trigger("pause");
    $("#beep").trigger("load");
    isTimerOn=false;
    clearInterval(timer);
    outputString= "25:00";
    breakMin =5;
    sessionMin =25;
    secondsLeft= 1500;
    isTimerOn= false;
    isOnBreak = false;
    $("#start_stop").css("background-color","green");
    $("#timer-label").text("Session");
    updateSessionMin();
    updateBreakMin();
    $("#time-left").text("25:00");
  });
  
  //timer circle pressed: start and stop timer
  $("#start_stop").click(function(){
    updateOutputString(secondsLeft);
    
    //if timer is on, then stop timer
    if(isTimerOn){
      isTimerOn=false;
      clearInterval(timer); //stops setInterval function
    }else{ //if timer is off then start timer
      isTimerOn=true;
      
      //update display every 1 second and switch/reset type/secondsLeft if secondsLeft reaches 0
      timer = setInterval(function(){
        if(secondsLeft == 0){ //if timer ends...
          $("#beep").trigger("play");
          
          if(isOnBreak){ //change to session type and reset secondsLeft
            isOnBreak=false;
            $("#start_stop").css("background-color","green");
            $("#timer-label").text("Session");
            secondsLeft= sessionMin*60 + 1;
            
          }else{ //change to break type and reset secondsLeft
            isOnBreak=true;
            $("#start_stop").css("background-color","red");
            $("#timer-label").text("Break");
            secondsLeft= breakMin*60 + 1;
          }
        }
        secondsLeft--;
        updateOutputString(secondsLeft);
      }, 1000); //1000 miliseconds = 1 second
    }
  });
});


var outputString= "25:00"; //string displayed on timer
var breakMin =5; //alotted time per break
var sessionMin =25; //alotted time per session
var secondsLeft= 1500; //amount of seconds left in current timer
var isTimerOn= false;
var isOnBreak = false;
var timer; //store setInterval function

//convert seconds to output string
function calcOutput(seconds){
  var output = ""; //X:XX:XX
  
  var tenMinutes = Math.floor(seconds/600);
  seconds -= tenMinutes*600;
  var minutes = Math.floor(seconds/60);
  seconds -= minutes*60;
  var tenSeconds = Math.floor(seconds/10);
  seconds -= tenSeconds*10;
  
  output += parseInt(tenMinutes);
  output += parseInt(minutes) + ":" + parseInt(tenSeconds) + parseInt(seconds);
  
  return output;
}

function updateOutputString(seconds){$("#time-left").text(calcOutput(seconds));}
function updateBreakMin(){$("#break-length").text(breakMin);}
function updateSessionMin(){$("#session-length").text(sessionMin);}
