const { DBConnect } = require('./DBConnect');
const db = new DBConnect();

async function registerUser(userObj) {
  try {
    let user = await registerUserAuth(userObj);
    let res = await db.CreateMember(user.memberName);
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
    await import('node-fetch').then(async (nodeFetch) => {
      const fetch = nodeFetch.default;
    
      const response = await fetch('http://localhost:4000/register', {
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