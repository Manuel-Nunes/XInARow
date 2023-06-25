const sql = require('mssql');

const config = {
  server: 'server',
  database: 'database',
  user: 'username',
  password: 'password',
};

async function registerUser(user) {
  try {
    registerUserAuth(user);
    // Create a new SQL connection pool
    const pool = await sql.connect(config);

    // Execute the stored procedure with the user object as parameters
    const result = await pool.request()
      .input('Username', sql.VarChar, user.username)
      .input('Email', sql.VarChar, user.email)
      .input('Password', sql.VarChar, user.password)
      .input('Salt', sql.VarChar, user.salt)
      .execute('sp_Member');

    // Close the SQL connection pool
    pool.close();

    return true; // Indicate successful registration
  } catch (error) {
    console.log(error);
    return false; // Indicate registration failure
  }
}

async function registerUserAuth(user) {
  try {
    const response = await fetch('http://localhost:4000/register', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('Registration successful!');
    } else {
      console.error('Registration failed!');
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = registerUser;