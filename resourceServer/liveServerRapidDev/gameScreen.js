import {
  genGameGrid
} from './genGameGrid.js';

import {
  showPopup
} from './popupControls.js';

const body = document.getElementById('body');

/**
 * @typedef {Object} GameSetup
 * @property {boolean} doRowCheck
 * @property {boolean} doColCheck
 * @property {boolean} doDiagonalCheck
 * @property {number} gridSideLength
 * @property {number} Xrequired
 */

let playerOne = true;

const gamesetup = {
  doRowCheck: true, 
  doColCheck: true,
  doDiagonalCheck: true,
  gridSideLength: 4,
  Xrequired: 4
};

let gameGrid;

/**
 * Enum for search Axis.
 * @readonly
 * @enum {number}
 */
const searchAxis = {
  Horizontal: 0,
  Vertical: 1,
  DiagTRBL: 2,
  DiagTLBR: 3
};

/**
 * Enum for search directions.
 * @readonly
 * @enum {number}
 */
const searchDirection = {
  Up:0,
  UpRight:1,
  Right:2,
  DownRight:3,
  Down:4,
  DownLeft:5,
  Left:6,
  UpLeft:7
};

/**
 * 
 * @param {number[]} inpArr 
 */
function hasWon(inpArr){
  for (let i = 0; i < inpArr.length;i++)
  {
    if (inpArr[i] >= gamesetup.Xrequired)
      return true;
  }
  return false;
}

/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {searchDirection} SD 
 */
function directionToGrid(x,y,SD){
  switch(SD){
  case searchDirection.Up:        return [x - 1,y];
  case searchDirection.UpRight:   return [x - 1,y + 1];
  case searchDirection.Right:     return [x,y + 1];
  case searchDirection.DownRight: return [x + 1,y + 1];
  case searchDirection.Down:      return [x + 1,y];
  case searchDirection.DownLeft:  return [x + 1,y - 1];
  case searchDirection.Left:      return [x,y - 1];
  case searchDirection.UpLeft:    return [x - 1,y - 1];
  }
}

/**
 * 
 * @param {searchDirection} SD 
 */
function directionToAxis(SD){
  switch(SD){
  case searchDirection.Up:
  case searchDirection.Down: return searchAxis.Vertical;

  case searchDirection.Right:
  case searchDirection.Left: return searchAxis.Horizontal;

  case searchDirection.DownLeft:
  case searchDirection.UpRight: return searchAxis.DiagTRBL;

  case searchDirection.DownRight:
  case searchDirection.UpLeft: return searchAxis.DiagTLBR;
  }
}

let currentUse = 0;
/**
 * 
 */
function checkGridSpace(){
  return currentUse >= gamesetup.gridSideLength * gamesetup.gridSideLength;
}

/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @returns {boolean} true if valid else false
 */
function checkIfCordsValid(x,y){
  if (x < 0 || x >= gamesetup.gridSideLength)
    return false;

  if (y < 0 || y >= gamesetup.gridSideLength)
    return false;

  return true;
}

/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {number} identity 
 * @param {searchDirect} direction 
 * @param {number[]} foundArr 
 */
function gridCheck(x,y,identity,direction,foundArr){
  if (!identity)
    identity = gameGrid[x][y];
  
  if (direction === undefined)
  {
    foundArr = [1,1,1,1];
    Object.keys(searchDirection).forEach(SDKey => {
      const dir = searchDirection[SDKey];
      const cord = directionToGrid(x,y,dir);
      if (checkIfCordsValid(cord[0],cord[1]))
        return gridCheck(cord[0],cord[1],identity,dir,foundArr);
    });
    return foundArr;
  }

  if ( gameGrid[x][y] === identity){
    foundArr[directionToAxis(direction)]++;
    
    const cords = directionToGrid(x,y,direction);
    if (checkIfCordsValid(cords[0],cords[1]))
      return gridCheck(cords[0],cords[1],identity,direction,foundArr);
  }

  return foundArr;
}

/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {HTMLElement} target 
 */
const click = (x,y,target)=>{
  x = parseInt(x);
  y = parseInt(y);

  console.log(`x: ${x} y: ${y}`);
  if (playerOne)
  {
    body.style.setProperty('background-color','#34366b');

    target.style.setProperty('background-color','blue');
    gameGrid[x][y] = 1;
  }
  else
  {
    body.style.setProperty('background-color','#4a1313');
    target.style.setProperty('background-color','red');
    gameGrid[x][y] = 2;
  }
  
  const arr = gridCheck(x,y);
  console.log(`${(playerOne) ? 'Player One' : 'Player Two'}: ${arr} ${hasWon(arr)}`);
  currentUse++;
  if (checkGridSpace())
  {
    showPopup('It is a draw!');
  }
  playerOne = !playerOne;
};

gameGrid = genGameGrid(gamesetup.gridSideLength,click);