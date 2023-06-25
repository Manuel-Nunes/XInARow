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

const conf = new Config(`./${serverFolder}/serverConfig.json`);
const PORT = conf.get('serverPort');

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

app.get('/submitRegister', function(req, res) {
  registerUser(req.body);
});

app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/views/login.html'));
});

app.get('/game',( req, res)=>{
  res.sendFile(path.join(__dirname, 'public/views/game.html'));
});

app.get('/homescreen',( req, res)=>{
  res.sendFile(path.join(__dirname, 'public/views/homescreen.html'));
});

app.post('/game', jsonParser , function (req , res){
  const { gameGrid, gameSettings } = req.body ;
  userGridPOST(gameGrid,gameSettings);
  res.send('Awe posted');
});

app.listen(PORT, () => {
  console.log(`App listening on port http://localhost:${PORT}`);
});