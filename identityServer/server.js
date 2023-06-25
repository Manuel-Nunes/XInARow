console.log('Starting Identity Server');

const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const {
  generateJWT,
  validateToken
} = require('../globalUtils/tokenManagement');

const { Config } = require('../globalUtils/configManager');

const app = express();
const serverFolder = 'identityServer';
const jsonParser = bodyParser.json();

const conf = new Config(`./${serverFolder}/serverConfig.json`);

const secretsConfig = new Config(`./${serverFolder}/secrets.json`);
const PORT = conf.get('serverPort');
const LOCAL_DEBUG = conf.get('localDebug');

const ALLOW_TEST_TOKEN = conf.get('allowTestTokenGeneration');

const JWTConfig = {
  secret: secretsConfig.get('JWTSecret'),
  options:{
    algorithm: secretsConfig.get('algorithm')
  }
};

console.log('Loading Static Folders');
fs.readdirSync(`./${serverFolder}/public` ,{
  withFileTypes: true 
})
  .filter(item => item.isDirectory())
  .forEach(folder => {
    app.use(express.static( path.join(__dirname,'public',folder.name)));
  });

app.post('/tokenValidate',jsonParser, (req,res)=>{
  const token = req.body.token;
  console.log(token);
  res.send({
    tokenIsValid: validateToken(token,JWTConfig)
  });
});

app.get('/getToken',jsonParser, (req,res)=>{
  if (ALLOW_TEST_TOKEN && LOCAL_DEBUG)
    res.send({
      token: generateJWT('TestUser123',JWTConfig)
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port http://localhost:${PORT}`);
});
