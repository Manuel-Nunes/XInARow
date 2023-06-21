/**
 * Callback to be executed when a grid item is clicked
 * @callback gridItemClick
 * @param {number} x
 * @param {number} y
 * @param {HTMLDivElement} target
 */

/**
 * 
 * @param {number} gridSize 
 * @param {gridItemClick} gridItemClickCB
 */
export function genGameGrid(gridSize, gridItemClickCB){
  const gameGrid = document.getElementById('gameGrid');

  gameGrid.style.setProperty('grid-template-columns',`repeat(${gridSize},1fr)`);
  
  for (let x = 0; x < gridSize; x++)
    for (let y = 0; y < gridSize; y++){
  
      /** @type {HTMLDivElement}*/ 
      const gridItem = document.createElement('div');
  
      gridItem.classList.add('gridItem');
      gridItem.addEventListener('click',(e)=>{
        /** @type {HTMLDivElement} */
        const gridItem = e.target;

        if (!gridItem.getAttribute('clicked'))
          gridItemClickCB(gridItem.getAttribute('X'), gridItem.getAttribute('Y'), gridItem);
        gridItem.setAttribute('clicked','true');
      });
  
      gridItem.setAttribute('X',x);
      gridItem.setAttribute('y',y);
  
      gameGrid.appendChild(gridItem);
    }
}

