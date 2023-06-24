const storageKeys = {
  WebToken: 'JWTStorage',
  Player1Account: 'PlayerOneAccount',
  Player2Account: 'PlayerTwoAccount',
};

export function ssStoreWebToken(Token){
  sessionStorage.setItem(storageKeys.WebToken, Token);
}

export function ssGetWebToken(){
  return sessionStorage.getItem(storageKeys.WebToken);
}

export function ssGetPlayer1Account(){
  return sessionStorage.getItem(storageKeys.Player1Account);
}

export function ssSetPlayer1Account(PlayerAccount){
  return sessionStorage.setItem(storageKeys.Player1Account,PlayerAccount);
}

export function ssGetPlayer2Account(){
  return sessionStorage.getItem(storageKeys.Player2Account);
}

export function ssSetPlayer2Account(PlayerAccount){
  return sessionStorage.setItem(storageKeys.Player2Account,PlayerAccount);
}