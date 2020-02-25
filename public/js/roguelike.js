/*
********DOES NOT WORK ON INTERNET EXPLORER. PLEASE USE FIREFOX, CHROME, OR SAFARI********************
Rougelike Dungeon Crawler is a game where the player moves through a dungeon, collects health and weapons, defeats enemies, and finds the door to the next dungeon.
-Square Color Scheme:
    Color       Type                  Int Value
    Black:      Darkness                 none
    Grey:       Wall                      1
    Pink:       Open space                0
    Blue:       Player                    4
    Green:      Health                    3
    Orange:     Weapon                    6
    Red:        Enemy                     2
    Maroon:     Door to next dungeon      5
    Red Circle: Final Boss                7
-Dungeons:
    --There are a limited amount of dungeons
    --Each dungeon is the same size
    --All dungeons have a set amount of weapons, health, and enemies
    --All dungeons except for the last one have a door to the next dungeon
-Player:
    --Player can only see a certain amount of squares around him unless darkness is toggled off.
    --Player can move up,down,left,right one square using arrow keys as long as it is not into a wall square
    --Player has a starting health and starting attack power
    --Player can increase player levels by gaining experience from defeating enemies
    --Health can be increased by collected health squares and gaining levels
    --Attack can be increased by collected weapon squares and gaining levels
    --When player loses all health, game restarts
-Enemies:
    --Enemies have a set health and damage determined by the dungeon level (higher dungeon level -> higher health and damage)
    --When player movies into enemy, player does damage to enemy. If enemy still has health, enemy then does damage to player
    --Defeating enemies gives experience to player with lead to increasing player levels.
    --When the final boss is defeated, the game is over and a new game starts
*/

import '../css/roguelike.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import $ from 'jquery';

//--Global Variables--//
const STANDARD_BOARD = new Array(40); //global custom board layout 40 cols, 80 rows
STANDARD_BOARD[0]  = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
STANDARD_BOARD[1]  = [1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
STANDARD_BOARD[2]  = [1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
STANDARD_BOARD[3]  = [1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
STANDARD_BOARD[4]  = [1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
STANDARD_BOARD[5]  = [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
STANDARD_BOARD[6]  = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
STANDARD_BOARD[7]  = [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
STANDARD_BOARD[8]  = [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1];
STANDARD_BOARD[9]  = [1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1];
STANDARD_BOARD[10] = [1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1];
STANDARD_BOARD[11] = [1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1];
STANDARD_BOARD[12] = [1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1];
STANDARD_BOARD[13] = [1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1];
STANDARD_BOARD[14] = [1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,0,0,0,0,0,1];
STANDARD_BOARD[15] = [1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1];
STANDARD_BOARD[16] = [1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1];
STANDARD_BOARD[17] = [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1];
STANDARD_BOARD[18] = [1,0,0,0,0,0,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1];
STANDARD_BOARD[19] = [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
STANDARD_BOARD[20] = [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1];
STANDARD_BOARD[21] = [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1];
STANDARD_BOARD[22] = [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1];
STANDARD_BOARD[23] = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1];
STANDARD_BOARD[24] = [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1];
STANDARD_BOARD[25] = [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1];
STANDARD_BOARD[26] = [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1];
STANDARD_BOARD[27] = [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1];
STANDARD_BOARD[28] = [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1];
STANDARD_BOARD[29] = [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
STANDARD_BOARD[30] = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
STANDARD_BOARD[31] = [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
STANDARD_BOARD[32] = [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
STANDARD_BOARD[33] = [1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
STANDARD_BOARD[34] = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
STANDARD_BOARD[35] = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
STANDARD_BOARD[36] = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
STANDARD_BOARD[37] = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
STANDARD_BOARD[38] = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
STANDARD_BOARD[39] = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];


const NUM_HEIGHT = 40; //number of squares along height of board
const NUM_WIDTH = 80; //number of squares along width of board

const WEAPON_TYPES = { //global var for weapon names and attacks
  default: {name: 'Bare Hands', attack: 0},
  0: {name: 'Wooden Stick', attack: 12},
  1: {name: 'Baseball Bat',attack: 24},
  2: {name: 'Crowbar',attack: 38},
  3: {name: 'Knife',attack: 54},
  4: {name: 'Long Sword',attack: 70}
};

const calcSquareLength = ()  => {
  let squareLength = Math.min((window.innerWidth - 30) / NUM_WIDTH, (window.innerHeight - 100) / NUM_HEIGHT);
  squareLength = Math.min(squareLength, 12.125);
  return squareLength
}



const getRandomPosition = (numHeight, numWidth) => {//get random col and row 
  return {
    col: Math.floor(Math.random() * numHeight), //random number from 0 to numHeight-1
    row: Math.floor(Math.random() * numWidth)
  };
};

const generateBoard = (dungeon) => { //generate a board at random from 4 designs and place all the needed components based on the dungeon level (0-4)
  
  let newBoard = new Array(NUM_HEIGHT);
  let boardSeed = Math.floor(Math.random()*4);
  
  for (var col = 0; col < NUM_HEIGHT; col++) { //create 1 of 4 preset boards using the standard global board as a template
        newBoard[col] = new Array(NUM_WIDTH);
        for (var row = 0; row < NUM_WIDTH; row++) {
          switch (boardSeed){
            case 0: //standard board
              newBoard[col][row] = STANDARD_BOARD[col][row]; 
              break;
            case 1: //standard board flipped vertically
              newBoard[col][row] = STANDARD_BOARD[Math.abs(col-(NUM_HEIGHT-1))][row];
              break;
            case 2: //standard board flipped horizontally
              newBoard[col][row] = STANDARD_BOARD[col][Math.abs(row-(NUM_WIDTH-1))];
              break;
            case 3: //standard board flipped vertically and horizontally
              newBoard[col][row] = STANDARD_BOARD[Math.abs(col-(NUM_HEIGHT-1))][Math.abs(row-(NUM_WIDTH-1))];
              break;
          }
        }
      }
 
  //place player square, value = 4
  let playerPosition = {};
  let placedPlayer = false;
  while(!placedPlayer){ //place the player square and set variable
    let randPos = getRandomPosition(NUM_HEIGHT, NUM_WIDTH);
    if(newBoard[randPos.col][randPos.row] == 0){//get random position and make sure it is free on the board
      newBoard[randPos.col][randPos.row] = 4;
      playerPosition = {col: randPos.col, row: randPos.row};
      placedPlayer = true; //get out of looop when player has been placed     
    }
  }
  
  //place door square, value = 5
  if(dungeon <4){//don't need door in last dungeon
    let placedDoor = false;
    while(!placedDoor){ //place door square if not in last dungeon
      let randPos = getRandomPosition(NUM_HEIGHT, NUM_WIDTH);
      if(newBoard[randPos.col][randPos.row] == 0){
        newBoard[randPos.col][randPos.row] = 5
        placedDoor = true;  
      }
    }
  }
  
  //place weapon square, value = 6
  let placedWeapon = false;
  while(!placedWeapon){ //place weapon square
    let randPos = getRandomPosition(NUM_HEIGHT, NUM_WIDTH);
    if(newBoard[randPos.col][randPos.row] == 0){
      newBoard[randPos.col][randPos.row] = 6;
      placedWeapon = true;  
    }
  }
  
  //place 5 health squares, value = 3
  for(let i=0; i<5; i++){ //run 5 times since need 5 health squares  
    let placedHealth = false;
    while(!placedHealth){ //place health squares
      let randPos = getRandomPosition(NUM_HEIGHT, NUM_WIDTH);
      if(newBoard[randPos.col][randPos.row] == 0){
        newBoard[randPos.col][randPos.row] = 3;
        placedHealth = true;  
      }
    }
  }
  
  //place 5 enemy squares, value = 2
  let enemies = [];
  for(let i=0; i<5; i++){ //run 5 times since need 5 enemy squares
    let placedEnemy = false;
    while(!placedEnemy){
      let randPos = getRandomPosition(NUM_HEIGHT, NUM_WIDTH);
      if(newBoard[randPos.col][randPos.row] == 0){
        newBoard[randPos.col][randPos.row] = 2;
        enemies.push({
          row: randPos.row, 
          col: randPos.col, 
          health: (dungeon+1)*25,
          maxDamage: (dungeon+1)*10,
          minDamage: (dungeon+1)*10 - 4
        });
        placedEnemy = true;  
      }
    }
  }
  
  //place final boss if dungeon level is 4, value = 7
  if(dungeon == 4){//boss dungeon add additional boss enemy 
    let placedBoss = false;
    while(!placedBoss){
      let randPos = getRandomPosition(NUM_HEIGHT, NUM_WIDTH);
      if(newBoard[randPos.col][randPos.row] == 0){
        newBoard[randPos.col][randPos.row] = 7;
        enemies.push({
          row: randPos.row, 
          col: randPos.col, 
          health: (dungeon+1)*100,
          maxDamage: (dungeon+1)*25,
          minDamage: (dungeon+1)*25 - 4
        });
        placedBoss = true;  
      }
    }
  }
  
  return {
    board: newBoard,
    playerPosition: playerPosition,
    enemies: enemies
  };
};

//---------------------------------------------------------------------------------

//--Reducers--//
const initValues = generateBoard(0); //default board, playerPosition, and enemies values

//the app board
const boardReducer = (state = initValues.board, action) => {
  
  let newBoard = new Array(NUM_HEIGHT); //duplicate board for move actions
  for (var col = 0; col < NUM_HEIGHT; col++) {
    newBoard[col] = new Array(NUM_WIDTH);
    for (var row = 0; row < NUM_WIDTH; row++) {
      newBoard[col][row] = state[col][row]; 
    }
  }
  
  let pos = action.playerPosition;
  switch (action.type) {
    case "MOVE_LEFT":
      newBoard[pos.col][pos.row] = 0; //make old square a free square
      newBoard[pos.col][pos.row - 1] = 4; //make square to the left a player square
      return newBoard;
    case "MOVE_RIGHT":
      newBoard[pos.col][pos.row] = 0; //make old square a free square
      newBoard[pos.col][pos.row + 1] = 4; //make square to the right a player square
      return newBoard;
    case "MOVE_UP":
      newBoard[pos.col][pos.row] = 0; //make old square a free square
      newBoard[pos.col - 1][pos.row] = 4; //make square above a player square
      return newBoard;
    case "MOVE_DOWN":
      newBoard[pos.col][pos.row] = 0; //make old square a free square
      newBoard[pos.col + 1][pos.row] = 4; //make square below a player square
      return newBoard;
    case "NEXT_DUNGEON":
      return action.payload.board; //newly generated board
    case "NEW_GAME":
      return action.payload.board; //newly generated board
    default:
      return state;
  }
};

//the player position
const playerPositionReducer = (state = initValues.playerPosition, action) => {
  switch (action.type) {
    case "MOVE_LEFT":
      return {
        ...state,
        row: state.row - 1
      };
    case "MOVE_RIGHT":
      return {
        ...state,
        row: state.row + 1
      };
    case "MOVE_UP":
      return {
        ...state,
        col: state.col - 1
      };
    case "MOVE_DOWN":
      return {
        ...state,
        col: state.col + 1
      };
    case "NEXT_DUNGEON":
      return action.payload.playerPosition;
    case "NEW_GAME":
      return action.payload.playerPosition;
    default:
      return state;
  }
};

//player damage
const healthReducer = (state = 100, action) => {
  switch (action.type) {
    case "GAIN_HEALTH":
      return state + 20;
    case "ATTACK_ENEMY":
      return state - action.enemyDamage;
    case "LEVEL_UP":
      return state + 60;
    case "NEW_GAME":
      return 100;
    default:
      return state;
  }
};

//current weapon equiped to player
const weaponReducer = (state = WEAPON_TYPES["default"]["name"], action) => {
  switch (action.type) {
    case "CHANGE_WEAPON":
      return action.newWeapon.name;
    case "NEW_GAME":
      return WEAPON_TYPES["default"]["name"];
    default:
      return state;
  }
};

//current attack damage of player
const attackReducer = (state = 7 + WEAPON_TYPES["default"]["attack"], action) => {
  switch (action.type) {
    case "CHANGE_WEAPON": //deduct atack from old weapon and add attack of new weapon
      return state - action.oldWeapon.attack + action.newWeapon.attack;
    case "LEVEL_UP":
      return state + 16;
    case "NEW_GAME":
      return 7 + WEAPON_TYPES["default"]["attack"];
    default:
      return state;
  }
};

//current level of player
const levelReducer = (state = 0, action) => {
  switch (action.type) {
    case "LEVEL_UP":
      return state + 1;
    case "NEW_GAME":
      return 0;
    default:
      return state;
  }
};

//experience needed until next level
const experienceReducer = (state = 70, action) => {
  switch (action.type) {
    case "GAIN_EXPERIENCE":
      return state - action.gainedXP;
    case "LEVEL_UP": //calculate needed XP for next level and substract leftoverXP
      return (action.level+1)*70 - action.leftoverXP;
    case "NEW_GAME":
      return 70;
    default:
      return state;
  }
};

//current dungeon level
const dungeonReducer = (state = 0, action) => {
  switch (action.type) {
    case "NEXT_DUNGEON":
      return state + 1;
    case "NEW_GAME":
      return 0;
    default:
      return state;
  }
};

//enemies on the current board
const enemiesReducer = (state = initValues.enemies, action) => {
  switch (action.type) {
    case "DEFEAT_ENEMY": //remove defeated enemy from array
      return [
        ...state.slice(0, action.enemyIndex),
        ...state.slice(action.enemyIndex+1)
        ];
    case "ATTACK_ENEMY":
      let adjustedEnemy = { //copy of enemy that was attacked with reduced health
        ...state[action.enemyIndex],
        health: state[action.enemyIndex].health - action.playerDamage
      };
      return [//replace modified enemy with old one
        ...state.slice(0, action.enemyIndex),
        adjustedEnemy,
        ...state.slice(action.enemyIndex + 1)
      ];
    case "NEXT_DUNGEON":
      return action.payload.enemies;
    case "NEW_GAME":
      return action.payload.enemies;
    default:
      return state;
  }
};

//if dark option is selected
const isDarkReducer = (state = true, action) => {
  switch (action.type) {
    case "TOGGLE_DARKNESS":
      return !state;
    case "NEW_GAME":
      return true;
    default:
      return state;
  }
};

const squareLengthReducer = (state = calcSquareLength(), action) => {
  switch (action.type) {
    case "SCREEN_RESIZE":
      return action.squareLength;
    default:
      return state;
  }
};

//parent reducer
const roguelikeGameReducer = Redux.combineReducers({
  board: boardReducer,
  playerPosition: playerPositionReducer,
  health: healthReducer,
  weapon: weaponReducer,
  attack: attackReducer,
  level: levelReducer,
  experience: experienceReducer,
  dungeon: dungeonReducer,
  enemies: enemiesReducer,
  isDark: isDarkReducer,
  squareLength: squareLengthReducer
});

//--------------------------------------------------------------------------------------------

//--React Components--//

//header react component with all the game stats
const Header = ({health, weapon, attack, level, experience, dungeon, toggleDarkness}) => (
  <div>
    <button className="button" onClick={()=>{toggleDarkness()}}>Toggle Darkness</button>
    <ul className="stats-list">
      <li>
        <h5>Health:</h5>
        <p>{health}</p>
      </li>
      <li>
        <h5>Weapon:</h5>
        <p>{weapon}</p>
      </li>
      <li>
        <h5>Attack:</h5>
        <p>{attack}</p>
      </li>
      <li>
        <h5>Level:</h5>
        <p>{level}</p>
      </li>
      <li>
        <h5>Experience:</h5>
        <p>{experience}</p>
      </li>
      <li>
        <h5>Dungeon:</h5>
        <p>{dungeon}</p>
      </li>
      
    </ul>
  </div>
);

const mapStateToHeaderProps = state => {
  return {
    health: state.health,
    weapon: state.weapon,
    attack: state.attack,
    level: state.level,
    experience: state.experience,
    dungeon: state.dungeon
  };
};

const matchDispatchToHeaderProps = (dispatch) => {
  return {
    toggleDarkness: () => { //button click toggles the darkness state value
      dispatch({type: 'TOGGLE_DARKNESS'});
    }
  };
}; 

const VisibleHeader = ReactRedux.connect( //create container and pass necessary redux values
  mapStateToHeaderProps,
  matchDispatchToHeaderProps
)(Header); 

//board react componant which contains all squares
class Board extends React.Component {
  drawBoard(board) {//converts board array into an array of div (square) components
    var squares = [];

    //cycle through board array and create colored div based on value
    for (var col = 0; col < NUM_HEIGHT; col++) {
      for (var row = 0; row < NUM_WIDTH; row++) {
        let curSqrVal = board[col][row];
        let playerPos = this.props.playerPosition;
        if(this.props.isDark &&  //if isDark is set and distance of square from player is more than 5 horizontally or vertically, color square black
          (Math.abs(playerPos.row-row) > 5 || Math.abs(playerPos.col-col) > 5)){
          squares.push(
            <div key={col + "-" + row} className="square-dark" />
          );
        }
        else{ //else color square based on value
          switch (curSqrVal) {
            case 0://free square
              squares.push(
                <div key={col + "-" + row} className="square-free"/>
              );
              break;
            case 1: //wall square
              squares.push(
                <div key={col + "-" + row} className="square-wall"/>
              );
              break;
            case 2: //enemy square
              squares.push(
                <div key={col + "-" + row} className="square-enemy"/>
              );
              break;
            case 3: //health square
              squares.push(
                <div key={col + "-" + row} className="square-health"/>
              );
              break;
            case 4: //player square
              squares.push(
                <div key={col + "-" + row} className="square-player"/>
              );
              break;
            case 5: //door square
              squares.push(//dark purple
                <div key={col + "-" + row} className="square-door"/>
              );
              break;
            case 6: //weapon square
              squares.push(
                <div key={col + "-" + row} className="square-weapon"/>
              );
              break;
            case 7: //boss square
              squares.push(//dark red, circular shaped
                <div key={col + "-" + row} className="square-boss"/>
              );
              break;
            default: //default is a free square
              squares.push(
                <div key={col + "-" + row} className="square-free"/>
              );
          }
        }
      }
    }
    return squares;
  }

  render() {
    let boardWidth = NUM_WIDTH * this.props.squareLength;
    let boardStyle = {
      width: boardWidth,
      gridTemplateColumns: "repeat(" + NUM_WIDTH + "," + this.props.squareLength + "px)",
      gridTemplateRows: "repeat(" + NUM_HEIGHT + "," + this.props.squareLength + "px)"
    }

    return (
      <div className="board" style={boardStyle}>
        {this.drawBoard(this.props.board)}
      </div>
    );
  }
}

const mapStateToBoardProps = state => {
  return {
    board: state.board,
    playerPosition: state.playerPosition,
    isDark: state.isDark,
    squareLength: state.squareLength
  };
};

const matchDispatchToBoardProps = dispatch => {
  return {
  };
}; 

const VisibleBoard = ReactRedux.connect(
  mapStateToBoardProps,
  matchDispatchToBoardProps
)(Board);

//parent React component
class RoguelikeGame extends React.Component{
  
  onKeyDownHandler(keyCode){//using keyCode and the target square value, call correct action/dispatch
    let state = this.props.state;
    let playerPosition = state.playerPosition;
    
    let moveSwitch = (targetPosition, moveFunction) =>{ //perform action based on target square value
      let targetVal = state.board[targetPosition.col][targetPosition.row];
     switch (targetVal){
       case 0: //free space, move to that space
         moveFunction(playerPosition);
         break;
       case 1: //wall, do nothing
         break;
       case 2://enemy, either attack, kill, or be killed
       case 7://boss: if kill boss then win game
         let enemy;
         let enemyIndex;
         for(let i=0; i<state.enemies.length; i++){ //cycle through enemies and find which as being attacked
           let en = state.enemies[i]; //individual enemy
           if(en.row == targetPosition.row && en.col == targetPosition.col){
             enemy = en; //enemy object
             enemyIndex = i; //index of enemy within enemies array
             break;
           }
         }
           let enemyDamage = //enemy attack damage is a random number between the min and the max damage
               Math.floor(Math.random() * (enemy.maxDamage - enemy.minDamage)) + enemy.minDamage;
         
           if(state.attack >= enemy.health){ //player defeats enemy, gain xp and move to the space
             this.props.defeatEnemy(enemyIndex);
             let gainedXP = (state.dungeon+1) * 10; //exp gained is based on dungeon level
             if(gainedXP >= state.experience){ //level up if gained enough xp
               this.props.levelUp(state.level+1, gainedXP - state.experience);
             }
             else{ //gain XP
               this.props.gainExperience(gainedXP);
             }
             moveFunction(playerPosition);
             if(targetVal == 7){ //if boss was the enemy defeated, then win game
               setTimeout(()=>{ //quick wait to allow move action to occur before alert
               alert("Congratulations! You have won!");
               this.props.newGame(generateBoard(0)); //start new game
               }, 200);
             }
           }
         
           else if(enemyDamage >= state.health){ //player dies -> start new game
              this.props.attackEnemy(state.attack, enemyDamage, enemyIndex);
              alert("You Died. Try again");
              this.props.newGame(generateBoard(0));
             
           }
           else{ //exchange damage -> lower player and enemy health
             this.props.attackEnemy(state.attack, enemyDamage, enemyIndex);
           }
           
        break;
       case 3://health -> player gains health, then move to space
         this.props.gainHealth();
         moveFunction(playerPosition);
         break;
       case 5://door -> generate next level dungeon
         this.props.nextDungeon(generateBoard(state.dungeon+1));
         break;
       case 6://weapon -> replace old weapon with the new one, then move to space
         var oldWeapon;
         if(state.dungeon == 0){
           oldWeapon = WEAPON_TYPES["default"];
         }
         else{
           oldWeapon = WEAPON_TYPES[state.dungeon-1];
         }
         let newWeapon = WEAPON_TYPES[state.dungeon];
         this.props.changeWeapon(oldWeapon, newWeapon);
         moveFunction(playerPosition);
         break;
      }
    }
    
    
    switch (keyCode) { //based on which arrow was pressed, call switch function and pass the playerPosition and the correct move function for that direction
      case 38: //up arrow
        console.log("up");
        if (playerPosition.col > 0) {
          moveSwitch(
            {col: playerPosition.col-1, row: playerPosition.row}, 
            this.props.movePlayerUp); 
        }
        break;
      case 40: //down arrow
        console.log("down");
        if (playerPosition.col < NUM_HEIGHT - 1) {
          moveSwitch(
            {col: playerPosition.col+1, row: playerPosition.row}, 
            this.props.movePlayerDown);
        }
        break;
      case 37: //left arrow
        console.log("left");
        if (playerPosition.row > 0) {
          moveSwitch(
            {col: playerPosition.col, row: playerPosition.row-1}, 
            this.props.movePlayerLeft);
        }
        break;
      case 39: //right arrow
        console.log("right");
        if (playerPosition.row < NUM_WIDTH - 1) {
          moveSwitch(
            {col: playerPosition.col, row: playerPosition.row+1}, 
            this.props.movePlayerRight);
        }
        break;
    }
  }
  
  componentDidMount(){ //activate listner right after component is mounted
    window.addEventListener('keydown', (e)=>{
      if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
        this.onKeyDownHandler(e.keyCode)
      }
      
    }) //run handler after every keydown event

    window.addEventListener('resize', (e)=>{
      let newSquareLength = calcSquareLength();
      if(newSquareLength != this.props.state.squareLength){
        this.props.screenResize(newSquareLength);
      }
    })
  }
  
  render() {
    return (
      <div>
        <VisibleHeader />
        <VisibleBoard />
        <div className="move-container">
          <div className="move-up" onClick={()=>{this.onKeyDownHandler(38)}}>&uarr;</div>
          <div className="move-left" onClick={()=>{this.onKeyDownHandler(37)}}>&larr;</div>
          <div className="move-right" onClick={()=>{this.onKeyDownHandler(39)}}>&rarr;</div>
          <div className="move-down" onClick={()=>{this.onKeyDownHandler(40)}}>&darr;</div>
        </div>
      </div>
    );
  }
}

const mapStateToRoguelikeGameProps = (state) => {
  return {
    state: state
  };
};

// Get actions and pass them as props to RoguelikeGame
const matchDispatchToRoguelikeGameProps = (dispatch) => {
  return {
    movePlayerLeft: (playerPosition) => { 
      dispatch({
        type: 'MOVE_LEFT',
        playerPosition: playerPosition //current player position
      });
    },
    movePlayerRight: (playerPosition) => {
      dispatch({
        type: 'MOVE_RIGHT',
        playerPosition: playerPosition //current player position
      });
    },
    movePlayerUp: (playerPosition) => {
      dispatch({
        type: 'MOVE_UP',
        playerPosition: playerPosition //current player position
      });
    },
    movePlayerDown: (playerPosition) => {
      dispatch({
        type: 'MOVE_DOWN',
        playerPosition: playerPosition //current player position
      });
    },
    gainHealth: () => {
      dispatch({
        type: 'GAIN_HEALTH'
      });
    },
    changeWeapon: (oldWeapon, newWeapon) => {
      dispatch({
        type: 'CHANGE_WEAPON',
        oldWeapon: oldWeapon, //old weapon object
        newWeapon: newWeapon //new weapon object
      });
    },
    newGame: (payload) => {
      dispatch({
        type: 'NEW_GAME',
        payload: payload //board, playerPosition, and enemies object
      });
    },
    defeatEnemy: (enemyIndex) => {
      dispatch({
        type: 'DEFEAT_ENEMY',
        enemyIndex: enemyIndex //array index of the defeated enemy
      });
    },
    attackEnemy: (playerDamage, enemyDamage, enemyIndex) => {
      dispatch({
        type: 'ATTACK_ENEMY',
        playerDamage: playerDamage, //player attack damage
        enemyDamage: enemyDamage, //enemy attack damage
        enemyIndex: enemyIndex //array index of the attack enemy
      });
    },
    nextDungeon: (payload) => {
      dispatch({
        type: 'NEXT_DUNGEON',
        payload: payload //board, playerPosition, and enemies object
      });
    },
    levelUp: (level, leftoverXP) => {
      dispatch({
        type: 'LEVEL_UP',
        level: level, //new level
        leftoverXP: leftoverXP //gained XP that is leftover and should be applied to next level
      });
    },
    gainExperience: (gainedXP) => {
      dispatch({
        type: 'GAIN_EXPERIENCE',
        gainedXP: gainedXP //experience gained
      });
    },
    screenResize: (squareLength) => { //button click toggles the darkness state value
      dispatch({
        type: 'SCREEN_RESIZE',
        squareLength: squareLength //new square length
      });
    }
  };
}; 

const VisibleRoguelikeGame = ReactRedux.connect( //container for roguelike game
  mapStateToRoguelikeGameProps,
  matchDispatchToRoguelikeGameProps
)(RoguelikeGame);

//create our Redux store
const actionLogger = ({ dispatch, getState }) => next => action => {
  //simple logger that logs action whenever one is performed
  console.log("Action:", action);
  return next(action); //must return this in order to process the current action on the store
};

const store = Redux.createStore(
  roguelikeGameReducer,
  Redux.applyMiddleware(actionLogger)
); //create store with parent reducer and actionLogger
store.subscribe(() => { //log statement to track state changes
  console.log("store:", store.getState());
});

$(document).ready(function() {
  ReactDOM.render(
    <ReactRedux.Provider store={store}>
      <VisibleRoguelikeGame />
    </ReactRedux.Provider>,
    document.getElementById("app")
  );
});
