import {
  FEConfig 
} from './clientConfig.js';
import {
  getAuthString 
} from './sessionUtils.js';

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
    home: '/homescreen',
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
    return page;
  else
    return `${window.location.origin}${page}`;
}

export async function postOutCome(outcome,gamesetup,gameGrid,profile1,profile2, cb){
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    gameSettings: gamesetup,
    gameGrid,
    profile1: profile1,
    profile2: profile2,
    winner: outcome
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  await fetch(`${window.location.origin}/game${getAuthString()}`, requestOptions);

  cb();
}