console.log('Starting Resource Server');

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const jsonParser = bodyParser.json();
const serverFolder = 'resourceServer';
const { Config } = require('../globalUtils/configManager');
const { userGridPOST } = require('./endpointHandlers');
const registerUser = require('./DatabaseHandlers/registerHandler');
const loginUser = require('./DatabaseHandlers/loginHandler');
const { checkUserID } = require('./checkUserID');
const { checkTokenAndRefresh } = require('../globalUtils/RSTokenManager');

const conf = new Config(`./${serverFolder}/serverConfig.json`);

const PORT = conf.get('serverPort');
const SKIP_ID_CHECK = conf.get('skipIDCheck');

console.log('Loading Static Folders');
fs.readdirSync(`./${serverFolder}/public` ,{
  withFileTypes: true
})
  .filter(item => item.isDirectory())
  .forEach(folder => {
    app.use(express.static( path.join(__dirname,'public',folder.name)));
  });

app.get('/register', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/views/register.html'));
});

app.post('/submitRegister', jsonParser, async function(req, res) {
  const data = await registerUser(req.body);
  res.json(data);
});

app.post('/submitLogin', jsonParser, async function(req, res) {
  const data = await loginUser(req.body);
  res.json(data);
});

app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/views/login.html'));
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/views/login.html'));
});

app.get('/game',jsonParser,( req, res)=>{
  if (!SKIP_ID_CHECK && (!req.body.memberID || !req.body.token)  )
    res.redirect('/login');

  if (!SKIP_ID_CHECK && !checkUserID(req.body.memberID,req.body.token ))
    res.redirect('/login');

  res.sendFile(path.join(__dirname, 'public/views/game.html'));
});

app.get('/homescreen',( req, res)=>{
  res.sendFile(path.join(__dirname, 'public/views/homescreen.html'));
});

app.post('/game', jsonParser , function (req , res){
  const { gameGrid, gameSettings,playerOne ,playerTwo } = req.body ;
  userGridPOST(gameGrid,gameSettings,playerOne, playerTwo);
  res.send('Awe posted');
});

app.listen(PORT, () => {
  console.log(`App listening on port http://localhost:${PORT}`);
});

checkTokenAndRefresh();
