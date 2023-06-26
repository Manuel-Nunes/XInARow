const { validateOutCome } = require('../globalUtils/gameValidator');

function userGridPOST(grid,settings,playerOne, playerTwo){
  console.log(grid);
  console.log(settings);
  validateOutCome(settings,grid);
}

module.exports = {
  userGridPOST
};