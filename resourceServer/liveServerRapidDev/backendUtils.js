/** @enum {string} */
export const pages = {
  game: '/game',
  home: '/homescreen.html',
  register: '/register',
  login: '/login'
};

/**
 * navigates to a spesific page
 * @param {pages} page 
 */
export function navigateTo(page){
  console.log(`${window.location.href}${page}`);
  // window.location.replace(`${window.location.host}${page}`);
}

export function postOutCome(outcome,gamesetup,gameGrid){
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    gameSettings: gamesetup,
    gameGrid,
    winner: outcome
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch('http://localhost:3000/game', requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}