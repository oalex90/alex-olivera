import '../css/calculator.scss';
import $ from 'jquery';

$(document).ready(function() {
  
  //number button pressed action 
  $("#zero").click(function(){
    if(!isBeginning){
    numPressed('0');
    }
  });
  $("#one").click(function(){
    numPressed('1');
  });
  $("#two").click(function(){
    numPressed('2');
  });
  $("#three").click(function(){
    numPressed('3');
  });
  $("#four").click(function(){
    numPressed('4');
  });
  $("#five").click(function(){
    numPressed('5');
  });
  $("#six").click(function(){
    numPressed('6');
  });
  $("#seven").click(function(){
    numPressed('7');
  });
  $("#eight").click(function(){
    numPressed('8');
  });
  $("#nine").click(function(){
    numPressed('9');
  });
  $("#decimal").click(function(){
    if(!isDecimal){
      isDecimal = true;
      numPressed('.');
    }
  });
  
   //symbol button pressed
  $("#add").click(function(){
    symbolPressed('+');
  });
  $("#subtract").click(function(){
    symbolPressed('-');
  });
  $("#multiply").click(function(){
    symbolPressed('*');
  });
  $("#divide").click(function(){
    symbolPressed('/');
  });
  $("#modulus").click(function(){
    symbolPressed('%');
  });
  
  //clear entry button pressed
  $("#clearentry").click(function(){
    if(outputString !=""){
      num = num.substring(0, num.length-1); //remove last char from num string
      if(outputString.substring(outputString.length-1) == '.'){
        isDecimal = false;
      }
      outputString = outputString.substring(0,outputString.length-1); //remove last char from output string
      updateOutput();
      showLog();
    }
  });
  
  //clear al button pressed
  $("#clear").click(function(){ //reset all values
    isPrevInputNum=true;
    isEqualsLastPressed=false;
    isBeginning=true;
    isDecimal = false;
    lastCharSymbol=false;
    isZero=true;
    num="";
    total=0;
    outputString="0";
    prevSymbol='';
    updateOutput();
    showLog();
  });
  
  $("#equals").click(function(){
    calculateTotal();
    outputString= total.toString();
    updateOutput();
    prevSymbol='';
    isPrevInputNum = false;
    isDecimal=false;
    isEqualsLastPressed = true;
    isZero=true;
    lastCharSymbol=false;
    num= total.toString() ;
    total=0;
    showLog();
  });
  
  
  
});

var prevSymbol =""; //the previous symbol pressed
var isPrevInputNum=true; 
var num=""; //current number string
var total=0; //current total
var outputString=""; //string output on display
var isEqualsLastPressed=false;
var isBeginning = true;
var isDecimal=false;
var isZero=true;
var lastCharSymbol = false

//action if num button is pressed
function numPressed(char){
  if(isBeginning){
    isBeginning = false;
    if(char == '.'){
      outputString = "0";
    } else{
      outputString = outputString.substring(0,outputString.length-1);
    }
  }
  if(!isPrevInputNum){ //if previous button pressed is not a number than we want to clear the output display
    outputString = "";
  }
  if(isEqualsLastPressed){ //if equals was last button pressed, we want to reset the number string
    num="";
    isEqualsLastPressed=false;
  }
  lastCharSymbol = false;
  num += char; //add number to current num string
  isPrevInputNum = true;
  outputString += char; //add number pushed to output display
  showLog();
  updateOutput();
}

function calculateTotal(){ //calculate total based on current total, the current number string, and the previous symbol pressed.
  switch(prevSymbol){
      case '+':
        total += parseFloat(num);
        break;
      case '-':
        total -= parseFloat(num);
        break;
      case '*':
        total *= parseFloat(num);
        break;
      case '/':
        total /= parseFloat(num);
        break;
      case '%':
        total = total % parseFloat(num);
        break;
      default:
        total = parseFloat(num);
  }
  if(isNaN(total)){ //if error occurs in calculating total, reset total to 0
      total=0;
  }
}

function symbolPressed(char){
  if(!lastCharSymbol){
    calculateTotal();
    num=""; //reset num string
    isPrevInputNum = false;
    outputString= total.toString(); //update display with current total
    showLog();
    updateOutput();
    isDecimal= false;
    lastCharSymbol= true;
  }
  prevSymbol= char;
}

function showLog(){ //for logging/debugging purposes
  console.log("\n num: " + num);
  console.log("total: " + total);
  console.log("outputString: " + outputString);
  console.log("prevSymbol: " + prevSymbol);
}

function updateOutput(){ //update output text value
  $("#text-output").text(outputString);
}


