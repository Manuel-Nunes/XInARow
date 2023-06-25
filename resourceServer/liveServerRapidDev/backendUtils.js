import {
  FEConfig 
} from './clientConfig.js';

/** @enum {string} */
let pages;

if (FEConfig.liveServerDev)
{
  pages = {
    game: 'http://127.0.0.1:5500/resourceServer/liveServerRapidDev/game.html',
    home: 'http://127.0.0.1:5500/resourceServer/liveServerRapidDev/homescreen.html',
    register: 'http://127.0.0.1:5500/resourceServer/liveServerRapidDev/register.html',
    login: 'http://127.0.0.1:5500/resourceServer/liveServerRapidDev/login.html'
  };
}
else
{
  pages = {
    game: '/game',
    home: '/homescreen.html',
    register: '/register',
    login: '/login'
  };
}

export {
  pages
};

/**
 * navigates to a spesific page
 * @param {pages} page 
 */
export function navigateTo(page){
  if (FEConfig.liveServerDev)
    window.location.replace(page);
  else
    window.location.replace(`${window.location.origin}${page}`);
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