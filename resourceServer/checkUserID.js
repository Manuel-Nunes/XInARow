const { DBConnect } = require('./DatabaseHandlers/DBConnect');
const { getHost } = require('./getHost');
const { tokenHolder } = require('../globalUtils/RSTokenManager');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const db = new DBConnect();
async function checkUserID(userID,token){
  const tokenCheck = await fetch(`${getHost()}/tokenValidate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',

    },
    body: JSON.stringify({
      token:token,
      RSToken: tokenHolder.token
    })
  });
  const data = await tokenCheck.json();
  console.log(data);
  if (!data.tokenIsValid)
    return false;

  const user = await db.Member(parseInt(userID));
  if (!user?.memberName)
    return false;

  const payload = token.split('.')[1];
  const tokenData = JSON.parse(atob(payload)) ;

  return user.memberName === tokenData.memberID;
}

module.exports = {
  checkUserID
};
