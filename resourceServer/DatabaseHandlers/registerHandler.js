const { DBConnect } = require('./DBConnect');
const db = new DBConnect();
const { getHost } = require('../getHost');
const { tokenHolder } = require('../globalUtils/RSTokenManager');

async function registerUser(userObj) {
  try {
    const user = await registerUserAuth(userObj);
    const res = await db.CreateMember(user.memberName);

    //res is memeberId, goes to profile page

    return res; // Indicate successful registration

  } catch (error) {
    console.log(error);

    return false; // Indicate registration failure
  }
}

async function registerUserAuth(user) {
  try {
    let res = undefined;

    user.RSToken = tokenHolder.token;

    await import('node-fetch').then(async (nodeFetch) => {
      const fetch = nodeFetch.default;

      const response = await fetch(`${getHost()}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });

      if (response.ok) {
        const data = await response.json();
        res = data;
      } else {
        console.log(response);
        console.error('Registration failed!');
      }
    });

    return res;

  } catch (error) {
    console.error(error);
  }
}

module.exports = registerUser;
