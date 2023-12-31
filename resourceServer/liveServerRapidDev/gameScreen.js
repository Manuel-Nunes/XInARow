import {
  genGameGrid
} from './genGameGrid.js';

import {
  showPopup
} from './popupControls.js';

import {
  postOutCome
} from './backendUtils.js';

import {
  ssGetGameSettings,
  ssGetPlayer1Account, 
  ssGetPlayer2Account,
  ssGetWebToken,
  ssGetMemberId
} from './sessionUtils.js';

const body = document.getElementById('body');
const exitButton = document.getElementById('game-exit');
exitButton.addEventListener('click', () => {
  window.location.replace(`/homescreen?token=${ssGetWebToken()}&memberID=${ssGetMemberId()}`) ;
});

/**
 * @typedef {Object} GameSetup
 * @property {boolean} doRowCheck
 * @property {boolean} doColCheck
 * @property {boolean} doDiagonalCheck
 * @property {number} gridSideLength
 * @property {number} Xrequired
 */

/** @type {HTMLImageElement} */ const player1Icon = document.getElementById('player1Icon');
/** @type {HTMLImageElement} */ const player2Icon = document.getElementById('player2Icon');

/** @type {HTMLParagraphElement} */ const player1Name = document.getElementById('player1Name').querySelector('p');
/** @type {HTMLParagraphElement} */ const player2Name = document.getElementById('player2Name').querySelector('p');


player1Icon.src = ssGetPlayer1Account().imageURL;
player2Icon.src = ssGetPlayer2Account().imageURL;

player1Name.innerText = ssGetPlayer1Account().username;
player2Name.innerText = ssGetPlayer2Account().username;

let playerOne = true;

/**
 * @type {GameSetup}
 */
const gamesetup = ssGetGameSettings();

let gameGrid = null;

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
  case searchDirection.Up:        return [x - 1, y];
  case searchDirection.UpRight:   return [x - 1, y + 1];
  case searchDirection.Right:     return [x, y + 1];
  case searchDirection.DownRight: return [x + 1, y + 1];
  case searchDirection.Down:      return [x + 1, y];
  case searchDirection.DownLeft:  return [x + 1, y - 1];
  case searchDirection.Left:      return [x, y - 1];
  case searchDirection.UpLeft:    return [x - 1, y - 1];
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
      if (!gamesetup.doColCheck)
      {
        if ( searchDirection[SDKey] === searchDirection.Up ||  searchDirection[SDKey] === searchDirection.Down)
          return foundArr;
      }

      if(!gamesetup.doRowCheck)
      {
        if ( searchDirection[SDKey] === searchDirection.Right ||  searchDirection[SDKey] === searchDirection.Left)
          return foundArr;
      }

      if(!gamesetup.doDiagonalCheck)
      {
        if ( searchDirection[SDKey] === searchDirection.DownLeft ||  searchDirection[SDKey] === searchDirection.UpRight ||  searchDirection[SDKey] === searchDirection.UpLeft || searchDirection[SDKey] === searchDirection.DownRight)
          return foundArr;
      }

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

  if (playerOne)
  {
    body.style.setProperty('background-color','var(--playerTwoColorBG)');
    target.style.setProperty('background-color','var(--playeOneColor)');
    gameGrid[x][y] = 1;
  }
  else
  {
    body.style.setProperty('background-color','var(--playerOneColorBG)');
    target.style.setProperty('background-color','var(--playerTwoColor)');
    gameGrid[x][y] = 2;
  }
  
  const arr = gridCheck(x,y);

  if (hasWon(arr))
  {
    postOutCome((playerOne) ? 1 : 2,gamesetup,gameGrid,ssGetPlayer1Account(),ssGetPlayer2Account(), ()=>{
      window.location.replace(`/homescreen?token=${ssGetWebToken()}&memberID=${ssGetMemberId()}`) ;
    });
    showPopup(
      `${(playerOne) ? 'Player One' : 'Player Two'} has won, saving outcome...`,
      (playerOne) ? '#34366b' : '#4a1313',
      ()=>{
      }
    );
    return;
  }

  currentUse++;

  if (checkGridSpace())
  {
    showPopup('It is a draw!', () => { 
      alert('Draw!');
    });
    postOutCome(0);
  }

  playerOne = !playerOne;
};

gameGrid = genGameGrid(gamesetup.gridSideLength,click);
window.history.pushState(null, null, '/game');