const sql = require('mssql');

const config = {
  server: 'server',
  database: 'database',
  user: 'username',
  password: 'password',
};

async function registerUser(user) {
    try {
      // Create a new SQL connection pool
      const pool = await sql.connect(config);
  
      // Execute the stored procedure with the user object as parameters
      const result = await pool.request()
        .input('Username', sql.NVarChar, user.username)
        .input('Email', sql.NVarChar, user.email)
        .input('Password', sql.NVarChar, user.password)
        .execute('sp_Member');
  
      // Handle the result as needed
      console.log(result);
  
      // Close the SQL connection pool
      pool.close();
  
      return true; // Indicate successful registration
    } catch (error) {
      console.log(error);
      return false; // Indicate registration failure
    }
}

module.exports = registerUser;