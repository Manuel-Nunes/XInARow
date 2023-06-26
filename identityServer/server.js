console.log('Starting Identity Server');

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const path = require('path');

const {
  generateJWT,
  validateToken
} = require('../globalUtils/tokenManagement');

const {
  generateRSJWT,
  checkProvidedRSPass,
  timeCheckToken,
  validateRSToken
} = require('../globalUtils/RSTokenHandler');


const { Config } = require('../globalUtils/configManager');
const registerUserOnAuthDB = require('./DatabaseHandlers/registerHandler');
const checkUserLoginOnAuthDB = require('./DatabaseHandlers/loginHandler');

const app = express();
const jsonParser = bodyParser.json();
const serverFolder = 'identityServer';

const conf = new Config(`./${serverFolder}/serverConfig.json`);

const secretsConfig = new Config(`./${serverFolder}/secrets.json`);
const PORT = conf.get('serverPort');
const LOCAL_DEBUG = conf.get('localDebug');
const SKIP_ID_CHECK = conf.get('skipIDCheck');
const ALLOW_TEST_TOKEN = conf.get('allowTestTokenGeneration');

function tokemCheck(req,res,next){
  if (!SKIP_ID_CHECK && ((!req.body.RSToken) || !timeCheckToken(req.body.RSToken) || !validateRSToken(req.body.RSToken)))
  {
    res.status(403);
    res.send('Token check Failed');
    return;
  }
  next();
}

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

app.post('/tokenValidate', jsonParser, tokemCheck, (req,res)=>{
  const token = req.body.token;
  console.log(token);

  res.json({
    tokenIsValid: validateToken(token,JWTConfig)
  });

  res.send();
});

app.get('/getToken', jsonParser, tokemCheck, (req,res)=>{
  if (ALLOW_TEST_TOKEN && LOCAL_DEBUG)
    res.send({
      token: generateJWT('TestUser123',JWTConfig)
    });
});

app.post('/register',jsonParser, async function(req, res) {

  const user = await registerUserOnAuthDB(req.body);
  if('error' in user){
    res.status(401).json(user);
    return;
  }

  res.json(user);
});

app.post('/login', jsonParser, tokemCheck, async function(req, res) {
  console.log('end point on id server hit');

  const user = await checkUserLoginOnAuthDB(req.body,JWTConfig);

  console.log(user);
  if('error' in user){
    res.status(401).json(user);
    return;
  }
  res.json(user);
  res.send();
  console.log('User Logged in successfully');
});

app.post('/ResourceServerLogin', jsonParser, async function (req, res) {
  if (!req.body?.password || !checkProvidedRSPass(req.body?.password))
  {
    res.status(403);
    res.send('Invalid Auth info');
    return;
  }
  console.log(`Resouce Server trying to login with: ${req.body?.password}`);
  res.json({
    token: generateRSJWT(req)
  });
  res.send();
});

app.listen(PORT, () => {
  console.log(`App listening on port http://localhost:${PORT}`);
});
