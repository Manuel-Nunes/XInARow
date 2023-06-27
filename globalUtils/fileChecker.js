const fs = require('fs');

function checkForHTTPsFiles(){
  let hasAll = true;
  if (!fs.existsSync('./cert.pem'))
  {
    console.log('Missing Cert file');
    hasAll = false;
  }

  if (!fs.existsSync('./key.pem')) {
    console.log('Missing key file');
    hasAll = false;
  }

  return hasAll;
}

function checkSecrets(path) {
  let hasAll = true;
  if (!fs.existsSync(`./${path}/secrets.json`)) {
    console.log('Missing Secrets file');
    hasAll = false;
  }

  return hasAll;
}

function comboCheck(path){
  let hasAll = true;
  if (!checkSecrets(path))
    hasAll = false;

  return hasAll;
}

module.exports = {
  checkForHTTPsFiles,
  checkSecrets,
  comboCheck
};
