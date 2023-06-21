import {
  genGameGrid
} from './genGameGrid.js';

let playerOne = true;

/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {HTMLElement} target 
 */
const click = (x,y,target)=>{
  console.log(`x: ${x} y: ${y}`);
  if (playerOne)
    target.style.setProperty('background-color','blue');
  else
    target.style.setProperty('background-color','red');

  playerOne = !playerOne;
};
genGameGrid(7,click);