import {
  ssGetPlayer1Account,
  ssSetPlayer1Account,
  ssGetPlayer2Account,
  ssSetPlayer2Account,
  ssGetWebToken,
  ssSetGameSettings,
  ssGetGameSettings,
  ssGetMemberId,
  getAuthString
} from './sessionUtils.js';

import {
  pages,
  navigateTo
} from './backendUtils.js';

/**
 * @typedef {Object} GameSetup
 * @property {boolean} doRowCheck
 * @property {boolean} doColCheck
 * @property {boolean} doDiagonalCheck
 * @property {number} gridSideLength
 * @property {number} Xrequired
 * @property {any} profile1
 * @property {any} profile2
 */

const playButton = document.getElementById('play');
/** @type {HTMLInputElement}*/ const doDiagCheck = document.getElementById('DiagCheck');
/** @type {HTMLInputElement}*/ const doRowCheck = document.getElementById('RowCheck');
/** @type {HTMLInputElement}*/ const doColCheck = document.getElementById('ColumnCheck');

/** @type {HTMLInputElement}*/ const gridSize = document.getElementById('gridSize');
/** @type {HTMLInputElement}*/ const inpXrequired = document.getElementById('Xrequired');
/** @type {HTMLInputElement}*/ const addProfile = document.getElementById('add-profile');
/** @type {HTMLInputElement}*/ const profileName = document.getElementById('name');
/** @type {HTMLInputElement}*/ const cancelCreateProfile = document.getElementById('cancel-add-profile');
/** @type {HTMLFormElement}*/ const createProfileForm = document.getElementById('profile-creation');


/** @type {HTMLLabelElement}*/ const errorMessageOut = document.getElementById('errorMessageOut');

function displayErrorMessage(message){
  errorMessageOut.style.setProperty('display','block');
  errorMessageOut.innerText = message;

}

function checksPassed(){
  clearErrorMessage();

  if (!doDiagCheck.checked && !doRowCheck.checked && !doColCheck.checked)
  {
    displayErrorMessage('Needs at least one check to win a game');
    doDiagCheck.focus();
  } else if(!ssGetPlayer1Account() || !ssGetPlayer2Account()){
    displayErrorMessage('Must have 2 Players');
  }else if(inpXrequired.value > gridSize.value){
    displayErrorMessage('X-in-a-row must be less than the board size');
  }else{
    clearErrorMessage();
    return true;
  }
  return false;
}

function clearErrorMessage(){
  errorMessageOut.style.setProperty('display','none');
}

doDiagCheck.addEventListener('click',checksPassed);
doRowCheck.addEventListener('click',checksPassed);
doColCheck.addEventListener('click',checksPassed);
cancelCreateProfile.addEventListener('click', closeForm);

createProfileForm.addEventListener('submit', (event) => {
  event.preventDefault();
  submitProfile().then(() => {
    initPage();
  }).catch((err) => {
    console.log(err);
    displayErrorMessage('Something went wrong');
  });
});

playButton.addEventListener('click',()=>{
  const player1 = ssGetPlayer1Account();
  const player2 = ssGetPlayer2Account();

  if(checksPassed()){

    /** @type {GameSetup} */ const gameSettings = {
      doRowCheck: doRowCheck.checked,
      doColCheck: doColCheck.checked,
      doDiagonalCheck: doDiagCheck.checked,
      gridSideLength: gridSize.value,
      Xrequired: inpXrequired.value,
      profile1: player1,
      profile2: player2 
    };
    
    ssSetGameSettings(gameSettings);
    window.location.href = `${window.location.origin}/game${getAuthString()}`; //genwine
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  await initPage();
});

async function initPage(){
  ssSetGameSettings(undefined);
  const jwt = ssGetWebToken();
  await getProfiles(jwt);
}

async function getProfiles(jwt) {
  ssSetPlayer1Account(undefined);
  ssSetPlayer2Account(undefined);
  try {
    const profiles = await (await fetch(`${window.location.origin}/member/${ssGetMemberId()}/profile${getAuthString()}`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: jwt
      }),
    })).json();

    const section = document.getElementById('profileSelection');
    section.innerHTML = '';

    if(profiles){
      profiles.forEach((profile) => {
        addProfileToView(profile, section);
      });
      if(profiles.length < 8){
        const article = document.createElement('article');
        article.classList.add('profile-display', 'clickable');

        const image = document.createElement('img');

        image.classList.add('h-centre');

        const nameParagraph = document.createElement('p');
        nameParagraph.textContent = 'Add user +';

        article.appendChild(image);
        article.appendChild(nameParagraph);
        section.appendChild(article);

        article.addEventListener('click', () => {
          openForm();
        });
      }
    }

  } catch (error) {
    console.error('Error occurred while building profile view:', error);
  }
}

function openForm() {
  var formContainer = document.getElementById('popupForm');
  formContainer.style.display = 'flex';

  // Calculate the vertical position to center the form
  var windowHeight = window.innerHeight;
  var formHeight = formContainer.offsetHeight;
  var marginTop = (windowHeight - formHeight) / 2;

  // Apply the calculated margin-top to center the form
  formContainer.style.marginTop = marginTop + 'px';
}

function closeForm() {
  document.getElementById('popupForm').style.display = 'none';
}

async function submitProfile(){
  if(profileName.value){
    const jwt = ssGetWebToken();
    await fetch(`${window.location.origin}/profile`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: jwt,
        profileName: profileName.value
      }),
    });//.json();
    
    // build api here and send to BE with {token, profileName}
    closeForm();
  }
}

function addProfileToView(profile, section){
  
  const article = document.createElement('article');
  article.classList.add('profile-display', 'clickable');

  const image = document.createElement('img');
  image.src = profile.imageURL;
  image.classList.add('h-centre');

  const nameParagraph = document.createElement('p');
  nameParagraph.textContent = profile.username;

  article.appendChild(image);
  article.appendChild(nameParagraph);

  section.appendChild(article);

  article.addEventListener('click', () => {

    const player1 = ssGetPlayer1Account();
    const player2 = ssGetPlayer2Account();
      
    if(player1 && player1.profileID === profile.profileID){
      article.classList.remove('clicked');
      ssSetPlayer1Account(undefined);
    }else if(player2 && player2.profileID === profile.profileID){
      article.classList.remove('clicked');
      ssSetPlayer2Account(undefined);
    }else if(!player1){
      ssSetPlayer1Account(profile);
      article.classList.add('clicked');
    }else if(!player2 && player1){
      ssSetPlayer2Account(profile);
      article.classList.add('clicked');
    }else if(player1 && player2){
      ssSetPlayer1Account(profile);
      ssSetPlayer2Account(undefined);

      const selectedProfiles = document.querySelectorAll('.profile-display.clickable.clicked');
      selectedProfiles.forEach((profile) => {
        profile.classList.remove('clicked');
      });
      article.classList.add('clicked');
    }
  });
}

clearErrorMessage();
window.history.pushState(null, null, '/homescreen');