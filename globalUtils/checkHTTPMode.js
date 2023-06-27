const fs = require('fs');

function isHTTPSMode(){
  return fs.existsSync('./key.pem') && fs.existsSync('./cert.pem');
}

module.exports = {
  isHTTPSMode
};
