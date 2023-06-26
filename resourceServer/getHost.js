const { Config } = require('./globalUtils/configManager');

const conf = new Config('./resourceServer/serverConfig.json');

function getHost(){
  return conf.get('isRunLocally') ? conf.get('localIdentityServer') :  conf.get('remoteIdentityServer');
}

module.exports = {
  getHost
};