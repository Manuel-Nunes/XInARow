const sql = require('mssql');
const { Config } = require('../../globalUtils/configManager');

const serverFolder = 'identityServer';
const DBConfig = new Config(`../../${serverFolder}/secrets.json`);

class DBConnect{
  constructor(){
    if(DBConnect.instance){
      return DBConnect.instance;
    } 
    
    DBConnect.instance = this;

    this.config = DBConfig.configObj;
  }

  //Private
  async #Connect(){
    try {
      // make sure that any items are correctly URL encoded in the connection string
      const connection = await sql.connect(this.config);
      return connection;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async CreateUser(email, password, memberName, salt){
    try{
      let connection = await this.#Connect();
      if(connection){
        const proc = new sql.Request(connection);
        proc.input('email', sql.VarChar, email);
        proc.input('password', sql.VarChar, password);
        proc.input('memberName', sql.VarChar, memberName);
        proc.input('salt', sql.VarChar, salt);

        const result = await proc.execute('sp_user');
        return result.recordset[0];
      }
    }catch (err){
      return {
        error:true,
        message:'There appears to be an issue with the database'
      };
    }
  }
  async UserExist(email){
    try{
      let connection = await this.#Connect();
      if(connection){
        const proc = new sql.Request(connection);
        proc.input('email', sql.VarChar, email);

        const result = await proc.execute('sp_user_exist');
        return result.recordset[0];
      }
    }catch (err){
      return {
        error:true,
        message:'There appears to be an issue with the database'
      };
    }
  }
  async Username(email){
    try{
      let connection = await this.#Connect();
      if(connection){
        const proc = new sql.Request(connection);
        proc.input('email', sql.VarChar, email);

        const result = await proc.execute('sp_username');
        return result.recordset[0];
      }
    }catch (err){
      return {
        error:true,
        message:'There appears to be an issue with the database'
      };
    }
  }
}

module.exports = {
  DBConnect
};

// Dummy call example
// async function main(){
//   let db = new DBConnect();
//   let res = await db.Username('');
//   console.log(res);
// }

// main();
