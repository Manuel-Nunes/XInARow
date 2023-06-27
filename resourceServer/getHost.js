const { Config } = require('../globalUtils/configManager');
const { isHTTPSMode } = require('../globalUtils/checkHTTPMode');

const conf = new Config('./resourceServer/serverConfig.json');

function getHost(){
  if (isHTTPSMode())
  {

    return conf.get('isRunLocally') ? conf.get('secureIdentityServer') : conf.get('secureIdentityServer');
  }
  else
  {
    return conf.get('isRunLocally') ? conf.get('localIdentityServer') : conf.get('remoteIdentityServer');
  }
}

module.exports = {
  getHost
};
