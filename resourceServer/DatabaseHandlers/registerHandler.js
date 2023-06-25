const sql = require('mssql');
const {DBConnect} = require("./DBConnect")

const db = new DBConnect();

async function registerUser(userObj) {
  try {
    let user = await registerUserAuth(userObj);
    console.log("user authorized, creating member");
    console.log(user);
    let res = await db.CreateMember(user.username);
    //res is memeberId, goes to profile page
    return res; // Indicate successful registration
  } catch (error) {
    console.log(error);
    return false; // Indicate registration failure
  }
}

async function registerUserAuth(user) {
  try {
    console.log("enter registerUserAuth on resource server");

    const response = await fetch('http://localhost:4000/register', {
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
      console.log(response);
      console.error('Registration failed!');
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = registerUser;