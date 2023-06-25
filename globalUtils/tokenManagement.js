const types = require('./types.js') ;

const jwt = require('jsonwebtoken');

const timeOut = 14_400_000;

function generateJWT(memberID, { secret, options }){
  let EAT = Date.now();
  EAT += timeOut;

  /**@type {types.AuthTokenObject} */ const payLoad = {
    memberID: memberID,
    EAT: EAT
  };
  const token = jwt.sign(payLoad,secret,options);

  return token;
}

function dateCheckToken(token){
  const data = jwt.decode(token);
  console.log(`Still Valid for: ${new Date(data.EAT - Date.now()).toISOString().slice(11, 19)}`);
  return data.EAT > Date.now();
}

function validateToken(token,{ secret, options }){
  let valid = false;
  try {
    valid = jwt.verify(token,secret,options);
    valid = dateCheckToken(token);
  } catch (error) {
    console.log('Invalid Token Passed in');
  }

  return valid;
}

module.exports = {
  generateJWT,
  validateToken
};