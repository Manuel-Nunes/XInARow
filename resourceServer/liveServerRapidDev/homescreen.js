import {
  ssGetPlayer1Account,
  ssSetPlayer1Account,
  ssGetPlayer2Account,
  ssSetPlayer2Account,
  ssSetGameSettings,
  ssGetGameSettings
} from './sessionUtils.js';

import {
  pages,
  navigateTo
} from './backendUtils.js';

/**
 * @typedef {Object} GameSetup
 * @property {boolean} doRowCheck
 * @property {boolean} doColCheck
 * @property {boolean} doDiagonalCheck
 * @property {number} gridSideLength
 * @property {number} Xrequired
 */

const playButton = document.getElementById('play');
/** @type {HTMLInputElement}*/ const doDiagCheck = document.getElementById('DiagCheck');
/** @type {HTMLInputElement}*/ const doRowCheck = document.getElementById('RowCheck');
/** @type {HTMLInputElement}*/ const doColCheck = document.getElementById('ColumnCheck');

/** @type {HTMLInputElement}*/ const gridSize = document.getElementById('gridSize');
/** @type {HTMLInputElement}*/ const inpXrequired = document.getElementById('Xrequired');


/** @type {HTMLLabelElement}*/ const errorMessageOut = document.getElementById('errorMessageOut');

function displayErrorMessage(message){
  errorMessageOut.style.setProperty('display','block');
  errorMessageOut.innerText = message;

}

function checkChange(){
  clearErrorMessage();

  if (!doDiagCheck.checked && !doRowCheck.checked && !doColCheck.checked)
  {
    displayErrorMessage('Needs at least one check to win a game');
    doDiagCheck.focus();
    return;
  }
}

function clearErrorMessage(){
  errorMessageOut.style.setProperty('display','none');
}

doDiagCheck.addEventListener('click',checkChange);
doRowCheck.addEventListener('click',checkChange);
doColCheck.addEventListener('click',checkChange);

playButton.addEventListener('click',()=>{
  /** @type {GameSetup} */ const gameSettings = {
    doRowCheck: doRowCheck.checked,
    doColCheck: doColCheck.checked,
    doDiagonalCheck: doDiagCheck.checked,
    gridSideLength: gridSize.value,
    Xrequired: inpXrequired.value
  };

  ssSetGameSettings(gameSettings);
  console.log(ssGetGameSettings());
  navigateTo(pages.game);
});

clearErrorMessage();