const { validateOutCome } = require('../globalUtils/gameValidator');
const { DBConnect } = require('./DatabaseHandlers/DBConnect');

const db = new DBConnect();

async function userGridPOST(gameGrid,gameSettings,profile1, profile2,winner){
  const ourWinner = validateOutCome(gameSettings,gameGrid);
  if (ourWinner !== winner)
  {
    console.log(`Mismatch game outcomes ${ourWinner} vs ${winner}`);
    return 'Failed to commit score different outcome detected';
  }
  
  try {
    const gameID = await db.CreateGame(parseInt(profile1.profileID), parseInt(profile2.profileID));
    const out = await db.UpdateGame(gameID.gameID,ourWinner + '');

    console.log(out);

    const resMess = 'Game was saved successfully';
    console.log(resMess);
    return resMess;  
  } catch (error) {
    return 'There were saving issues';
  }
}

module.exports = {
  userGridPOST
};