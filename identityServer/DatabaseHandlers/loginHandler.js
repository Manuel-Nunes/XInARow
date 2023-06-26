const bcrypt = require('bcrypt');
const { DBConnect } = require('./DBConnect');
const { generateJWT } = require('../../globalUtils/tokenManagement');

const db = new DBConnect();

async function checkPassword(hashPassword, salt, password) {
  try {
    const isMatch = await bcrypt.compare(password, hashPassword);
    return isMatch;
  } catch (error) {
    console.error('Error hashing password:', error);
    // throw error;
  }
}

async function checkUserLoginOnAuthDB(user, JWTConfig) {
  try {
    let res = await db.UserExist(user.email);
    const { password, salt } = res;
    if(await checkPassword(password, salt, user.password)){
      let member = await db.Username(user.email);
      console.log(member);
      member.token = generateJWT(member.memberName,JWTConfig);
      console.log(member);
      return member; // Indicate successful registration
    }
    return {
      'error':true
    };
  } catch (error) {
    console.log(error);
    return {
      'error':true
    }; // Indicate registration failure
  }
}

module.exports = checkUserLoginOnAuthDB;
