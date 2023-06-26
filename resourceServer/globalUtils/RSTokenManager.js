const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const { Config } = require('./globalUtils/configManager');
const { timeCheckToken,getTokeTimeRemaining } = require('./RSTokenHandler');
const { getHost } = require('../resourceServer/getHost');

const conf = new Config('./resourceServer/secrets.json');

const RSPass = conf.get('resourceServerPassword');

const tokenHolder = {
  token: undefined
};

async function getNewToken(){
  try {
    const fetchRes = await fetch(`${getHost()}/ResourceServerLogin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'password': RSPass
      })
    });

    const resJson = await fetchRes.json();
    return resJson.token;
  } catch (error) {
    console.log('Identity Server unavailable Could not get token');

    return '';
  }

}

async function checkTokenAndRefresh() {
  if (!tokenHolder.token || timeCheckToken(tokenHolder.token))
  {
    tokenHolder.token = await getNewToken();
  }

  setTimeout(async ()=>{
    await checkTokenAndRefresh();
  }, getTokeTimeRemaining(tokenHolder.token) - 5000);
}

module.exports = {
  checkTokenAndRefresh,
  tokenHolder
};
