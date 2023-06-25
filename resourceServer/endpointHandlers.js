const { validateOutCome } = require('../globalUtils/gameValidator');

function userGridPOST(grid,settings){
  console.log(grid);
  console.log(settings);
  validateOutCome();
}

module.exports = {
  userGridPOST
};