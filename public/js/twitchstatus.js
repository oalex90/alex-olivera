import '../css/twitchstatus.scss';
import $ from 'jquery';

var curStatus = "all"; //current status tab selected
var results = []; //array of results

var streamers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "randadsfdf"]; //array of twitch channels that will be included

$(document).ready(function() {
  
  selectStatus("#div-all"); //show All status tab is selected at the start
  
  //create and add Result objects to the results array using twitch api calls
  for(var i=0; i<streamers.length; i++){ //for each twitch user in array, retrieve required info and create a Result object
    var curUsername = streamers[i];

    $.getJSON('https://wind-bow.gomix.me/twitch-api/streams/' + curUsername + '?callback=?', function(){ //function() is a closure used to pass curUsername into the function
      var username = curUsername; //passing curUsername
      return function (data){ //api function that retrieves curStatus from /streams api call               
        var newResult = new Result(username);
        
        if (data.stream == null){//offline and unavailable channels. curStatus of unvavailable channels will be updated later
          newResult.curStatus = "offline";
        } else{
          newResult.curStatus = "online";
        }

        //retrieve rest of Result variables and display Result and add Result to results array
        $.getJSON('https://wind-bow.gomix.me/twitch-api/channels/' + username + '?callback=?', function(obj){ //api function that retrieves rest of Result variables from /channels api call
          
          if(obj.status === 404){ //if status is 404, then "unavailable"
            newResult.curStatus = "unavailable";
            newResult.displayName = newResult.username;
          }
          else{
            newResult.statusMessage = obj.status;
            newResult.displayName = obj.display_name;
            newResult.logo = obj.logo;
            newResult.game = obj.game;  
          }
          results.push(newResult); //add Result to results array
          displayResult(newResult); //add Result to HTML
        }); //end of get channels function    
      }; //end of return (get streams) function            
    }()); //end of closure function
  }//end of for loop
   
 $("#div-all").click(function(){//if Online status tab is clicked and if it is not already clicked, make clicked, and display Results with a curStatus of "online" 
    if (curStatus !== "all"){//if Online status tab is not already clicked
      selectStatus("#div-all");//maked clicked
      $("#div-online").removeAttr("style"); //make unclicked
      $("#div-offline").removeAttr("style"); //make unclicked
      curStatus = "all";
      $("#div-results").empty(); //remove current html Results
      for(var i=0; i<results.length; i++){ //display Results with a curStatus of "online"
        displayResult(results[i]);
      }
    }
  });
  
  $("#div-online").click(function(){//if Online status tab is clicked and if it is not already clicked, make clicked, and display Results with a curStatus of "online" 
    if (curStatus !== "online"){//if Online status tab is not already clicked
      selectStatus("#div-online");//maked clicked
      $("#div-all").removeAttr("style"); //make unclicked
      $("#div-offline").removeAttr("style"); //make unclicked
      curStatus = "online";
      $("#div-results").empty(); //remove current html Results
      for(var i=0; i<results.length; i++){ //display Results with a curStatus of "online"
        var curResult = results[i];
        if(curResult.curStatus === "online"){
          displayResult(curResult);
        }
      }
    }
  });
  
  $("#div-offline").click(function(){ //if Offline status tab is clicked and if it is not already clicked, make clicked, and display Results with a curStatus that is not "online"
    if (curStatus !== "offline"){//if Offline status tab is not already clicked
      selectStatus("#div-offline"); //make clicked
      $("#div-online").removeAttr("style"); //make unclicked
      $("#div-all").removeAttr("style"); //make unclicked
      curStatus = "offline";
      $("#div-results").empty(); //remove current html Results
      for(var i=0; i<results.length; i++){ //display Results with a curStatus that is not "online"
        var curResult = results[i];
        if(curResult.curStatus !== "online"){
          displayResult(curResult);
        }
      }
    }
  });
  
  function selectStatus(statusID){ //change css to make given status tab element look selected
    $(statusID).css("border-top", "10px solid darkgreen");
    $(statusID).css("margin-top", "-10px"); //allows border to show above the status box
  }
});

function Result(username){ //object to store necessary info about a twitch user
  this.username = username;
  var displayName;
  var logo; //image url
  var game; //game last played
  var statusMessage;
  var curStatus; //offline or online or unavailable;
};

Result.prototype.getURL = function(){ //uses username to calculate and return the twitch channel's url
  return "https://twitch.tv/" + this.username;
};

Result.prototype.logAll = function(){ //used for logging purposes
  console.log("username: ", this.username);
  console.log("displayName: ", this.displayName);
  console.log("curStatus: ", this.curStatus)
  console.log("logo: ", this.logo);
  console.log("game: ", this.game);
  console.log("statusMessage: ", this.statusMessage);
  console.log("URL: ", this.getURL());
};

function displayResult(result){ //generates html and adds it to div-results using the given Result's variables
  if(result.logo === undefined || result.logo === null){ //use stock image if logo does not point to an image
    result.logo = "http://www.blohards.com/blohards/uploads/unavailable.jpg";
  }
  
  var icon; //curStatus icon
  var iconColor; //curStatus icon color
  var gameAndStatus; //either game and status variables, unavailable, or offline; depending on curStatus
  if(result.curStatus === "online"){ //if curStatus is online, make icon green checkmark, and set gameAndStatus (shorten if too long) 
    icon = "fa-check-circle";
    iconColor = "green";
    var game = toTitleCase(result.game);
    var statusMessage = toTitleCase(result.statusMessage);
    gameAndStatus = game + ": " + statusMessage;
    
    if(gameAndStatus.length >27){ //if var is greater than 27 characters, shorten to 24 characters and add "..."
      gameAndStatus = gameAndStatus.substring(0,24) + "...";
    }
  } else if(result.curStatus == "offline"){ //if curStatus is offline, make icon red minus, and set gameAndStatus
    icon = "fa-minus-circle";
    iconColor = "red";
    gameAndStatus = "User is Offline";
  } else { //if curStatus is unavailable, make icon purple exclamation, and set gameAndStatus
    icon = "fa-exclamation-circle"
    iconColor = "purple";
    gameAndStatus = "Account Unavailable"
  }
  
  //create html with function's and Result's variables
  var linkHtml = '<a href="'+ result.getURL() +'" target="_blank" style="text;green; text-decoration:none;"><div class="result"><image class = "img-circle" src="' + result.logo + '"style="height:60px; width:60px;"></image><div style="justify-self:start; margin-left:10px; margin-top:7px"><p style="font-size: 17px; font-weight:bold; color:green">' + result.displayName + '</p><p style="color:grey; font-size:13px; font-style:italic; margin-top:-5px">' + gameAndStatus + '</p></div><i class="fa '+ icon +' fa-3x" style="color:'+ iconColor +'; margin-top:10px"></i></div></a>'
  
  $("#div-results").prepend(linkHtml); //add Result html to Results section
}

function toTitleCase(str){
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}