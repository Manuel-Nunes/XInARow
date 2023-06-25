const sql = require('mssql');
const { Config } = require('../../globalUtils/configManager');

const serverFolder = 'resourceServer';
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

  /**
   * Create a game between 2 players
   * @param {Int} player1 - ProfileID
   * @param {Int} player2 - ProfileID
   * @returns The gameID of the newely created game
   */
  async CreateGame(player1, player2){
    try{
      let connection = await this.#Connect();
      if(connection){
        const proc = new sql.Request(connection);
        proc.input('player1', sql.Int, player1);
        proc.input('player2', sql.Int, player2);

        const result = await proc.execute('sp_create_game');
        return result.recordset[0];
      }
    }catch (err){
      return {
        error:true,
        message:'There appears to be an issue with the database'
      };
    }
  }

  async CreateMember(memberName){
    try{
      let connection = await this.#Connect();
      if(connection){
        const proc = new sql.Request(connection);
        proc.input('memberName', sql.VarChar, memberName);

        const result = await proc.execute('sp_create_member');
        return result.recordset[0];
      }
    }catch (err){
      return {
        error:true,
        message:'There appears to be an issue with the database'
      };
    }
  }

  async CreateProfile(username, profileImage, memberID){
    try{
      let connection = await this.#Connect();
      if(connection){
        const proc = new sql.Request(connection);
        proc.input('username', sql.VarChar, username);
        proc.input('profileImage', sql.Int, profileImage);
        proc.input('memberID', sql.Int, memberID);

        const result = await proc.execute('sp_create_profile');
        return result.recordset[0];
      }
    }catch (err){
      return {
        error:true,
        message:'There appears to be an issue with the database'
      };
    }
  }

  async Member(member){
    try{
      let connection = await this.#Connect();
      if(connection){
        const proc = new sql.Request(connection);
        let procName = '';
        if(typeof(member) === 'string'){
          proc.input('memberName', sql.VarChar, member);
          procName = 'sp_member';
        }else if(typeof(member) === 'number'){
          proc.input('memberID', sql.Int, member);
          procName = 'sp_member_id';
        }

        const result = await proc.execute(procName);
        return result.recordset[0];
      }
    }catch (err){
      return {
        error:true,
        message:'There appears to be an issue with the database'
      };
    }
  }

  async Profiles(member){
    try{
      let connection = await this.#Connect();
      if(connection){
        const proc = new sql.Request(connection);
        let procName = '';
        if(typeof(member) === 'string'){
          proc.input('memberName', sql.VarChar, member);
          procName = 'sp_profiles';
        }else if(typeof(member) === 'number'){
          proc.input('memberID', sql.Int, member);
          procName = 'sp_profiles_id';
        }

        const result = await proc.execute(procName);
        return result.recordset;
      }
    }catch (err){
      return {
        error:true,
        message:'There appears to be an issue with the database'
      };
    }
  }

  async Profile(profileID){
    try{
      let connection = await this.#Connect();
      if(connection){
        const proc = new sql.Request(connection);
        proc.input('profileID', sql.Int, profileID);

        const result = await proc.execute('sp_profile_game_wld');
        return result.recordset[0];
      }
    }catch (err){
      return {
        error:true,
        message:'There appears to be an issue with the database'
      };
    }
  }

  async UpdateGame(gameID, gameResult){
    try{
      let connection = await this.#Connect();
      if(connection){
        const proc = new sql.Request(connection);
        proc.input('gameID', sql.Int, gameID);
        proc.input('result', sql.VarChar, gameResult);

        await proc.execute('sp_update_game');
        return {
          error : false, 
          message:'Updated Successfully'
        };
      }
    }catch (err){
      return {
        error:true,
        message:'There appears to be an issue with the database'
      };
    }
  }

  async UpdateProfile(profileID, imageID){
    try{
      let connection = await this.#Connect();
      if(connection){
        const proc = new sql.Request(connection);
        proc.input('profileID', sql.Int, profileID);
        proc.input('imageID', sql.Int, imageID);

        await proc.execute('sp_update_profile');
        return {
          error : false, 
          message:'Updated Successfully'
        };
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
//   let res = await db.UpdateProfile(1, 3);
//   console.log(res);
// }

// main();
