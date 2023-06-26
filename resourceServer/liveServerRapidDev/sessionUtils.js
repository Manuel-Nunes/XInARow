/** @enum {string} */
const storageKeys = {
  WebToken: 'JWTStorage',
  Player1Account: 'PlayerOneAccount',
  Player2Account: 'PlayerTwoAccount',
  gameSettings: 'GameSettings',
  memberID: 'memberID'
};

export function ssStoreWebToken(Token){
  sessionStorage.setItem(storageKeys.WebToken, JSON.stringify(Token) );
}

export function ssGetWebToken(){
  return JSON.parse(sessionStorage.getItem(storageKeys.WebToken)) ;
}

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

export function ssGetMemberID(){
  return JSON.parse(sessionStorage.getItem(storageKeys.memberID)) ;
}

export function ssSetMemberID(memberID){
  return sessionStorage.setItem(storageKeys.memberID, JSON.stringify(memberID));
}

export function getAuthString(){
  return `?token=${ssGetWebToken()}&memberID=${ssGetMemberID()}`;
}