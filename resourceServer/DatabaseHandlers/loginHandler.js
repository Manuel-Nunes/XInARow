const fetch = require('node-fetch');
const { DBConnect } = require('./DBConnect');

const db = new DBConnect();

async function loginUser(userObj) {
  try {
    let user = await loginUserAuth(userObj);
    let res = await db.Member(user.memberName);
    res = res.memberID;
    //res is memeberId, goes to profile page
    return res; // Indicate successful registration
  } catch (error) {
    console.log(error);
    return false; // Indicate registration failure
  }
}

async function loginUserAuth(user) {
  try {
    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('Login failed!');
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = loginUser;