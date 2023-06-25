const bcrypt = require('bcrypt');
const { DBConnect } = require('./DBConnect');

const db = new DBConnect();

async function checkPassword(hashPassword, salt, password) {
  try {
    const newHashedPassword = await bcrypt.hash(password, salt);

    return newHashedPassword === hashPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    // throw error;
  }
}

async function checkUserLoginOnAuthDB(user) {
  try {
    let res = await db.UserExist(user.email);
    const { hashPassword, salt } = res;
    if(await checkPassword(hashPassword, salt, user.password)){
      let member = await db.Username(user.email);
      return member; // Indicate successful registration
    }
    return false;
  } catch (error) {
    console.log(error);
    return false; // Indicate registration failure
  }
}

module.exports = checkUserLoginOnAuthDB;