const { DBConnect } = require('./DBConnect');
const { getHost } = require('../getHost');
const { tokenHolder } = require('../../globalUtils/RSTokenManager');

const db = new DBConnect();

async function loginUser(userObj) {
  try {
    const user = await loginUserAuth(userObj);
    let res = await db.Member(user.memberName);
    res = {
      'memberID':res.memberID,
      'token': user.token,
      'memberName': user.memberName
    };
    //res is memeberId, goes to profile page
    return res; // Indicate successful registration
  } catch (error) {
    return {
      'memberID':null,
      'token':null
    }; // Indicate registration failure
  }
}

async function loginUserAuth(user) {
  try {
    return await import('node-fetch').then(async (nodeFetch) => {
      const fetch = nodeFetch.default;

      user.RSToken = tokenHolder.token;

      const response = await fetch(`${getHost()}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)

      });

      if (response.ok) {
        return await response.json();
      } else {
        console.log(response);
        console.error('Login failed!');
      }
    });

  } catch (error) {
    console.error(error);
  }
}

module.exports = loginUser;
