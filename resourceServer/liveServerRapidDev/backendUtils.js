function getRelativeURL(){
  const currentUrl = window.location.href;
  console.log(currentUrl);

  const host = window.location.host;
  console.log(`This is Host: ${host} `);
}

getRelativeURL();

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