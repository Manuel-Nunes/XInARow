/** @enum {string} */
const storageKeys = {
  WebToken: 'JWTStorage',
  Player1Account: 'PlayerOneAccount',
  Player2Account: 'PlayerTwoAccount',
  gameSettings: 'GameSettings',
  memberID: 'memberID'
};

/**
 * @typedef PlayerProfile
 * @property {string} imageURL
 * @property {number} profileID
 * @property {string} username
 */

export function ssStoreWebToken(Token){
  sessionStorage.setItem(storageKeys.WebToken, JSON.stringify(Token) );
}

export function ssGetWebToken(){
  return JSON.parse(sessionStorage.getItem(storageKeys.WebToken)) ;
}

/**
 * Returns profile stored in player1
 * @returns {PlayerProfile}
 */
export function ssGetPlayer1Account(){
  try{
    return JSON.parse(sessionStorage.getItem(storageKeys.Player1Account));
  }catch{
    return undefined;
  }
}

export function ssSetPlayer1Account(PlayerAccount){
  return  sessionStorage.setItem(storageKeys.Player1Account,JSON.stringify(PlayerAccount));
}

/**
 * Returns profile stored in player2
 * @returns {PlayerProfile}
 */
export function ssGetPlayer2Account(){
  try{
    return JSON.parse(sessionStorage.getItem(storageKeys.Player2Account));
  }catch{
    return undefined;
  }
}

export function ssSetPlayer2Account(PlayerAccount){
  return sessionStorage.setItem(storageKeys.Player2Account, JSON.stringify(PlayerAccount));
}

export function ssGetGameSettings(){
  return JSON.parse(sessionStorage.getItem(storageKeys.gameSettings)) ;
}

export function ssSetGameSettings(gameSettings){
  return sessionStorage.setItem(storageKeys.gameSettings, JSON.stringify(gameSettings));
}

export function ssSetMemberID(memberID){
  return sessionStorage.setItem(storageKeys.memberID, JSON.stringify(memberID));
}

export function getAuthString(){
  return `?token=${ssGetWebToken()}&memberID=${ssGetMemberId()}`;
}

export function ssGetMemberId(){
  try{
    return JSON.parse(sessionStorage.getItem(storageKeys.memberID));
  }catch{
    return undefined;
  }
}