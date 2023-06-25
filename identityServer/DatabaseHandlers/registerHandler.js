const bcrypt = require('bcrypt');
const {DBConnect} = require("./DBConnect")

const db = new DBConnect();

async function hashPassword(user) {
  const { email, password, username } = user;
  console.log("hashing password");

  try {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.salt = salt;

    return user;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
}

async function registerUserOnAuthDB(user) {
    try {
        let user = hashPassword(user);
        
        if(validateObject(user.email, user.username)){
          let res = await db.CreateUser(user.email, user.password, user.username, user.salt)
        }
        console.log("user validated by id server");

        return res; // Indicate successful registration
    } catch (error) {
        console.log(error);
        return false; // Indicate registration failure
    }
}

function validateObject(email, username) {
  // Check if any field is empty
  if (username === '' || email === '' ) {
    return false;
  }

  // Check if email is valid using a simple regular expression
  let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return false;
  }

  // Check if user is valid (no special characters).
  let usernamePattern = /^[a-zA-Z0-9]+$/;
  if(!usernamePattern.test(username)){
    return false;
  }

  // All validations passed
  return true;
}

module.exports = registerUserOnAuthDB