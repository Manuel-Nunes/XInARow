console.log('Starting Identity Server');

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const jsonParser = bodyParser.json();
const serverFolder = 'identityServer';
let registerUserOnAuthDB = require('./DatabaseHandlers/registerHandler');
let checkUserLoginOnAuthDB = require('./DatabaseHandlers/registerHandler');
const { Config } = require('../globalUtils/configManager');

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

app.get('/i', function(req, res) {
  res.sendFile(path.join(__dirname, '/index2.html'));
});

app.listen(PORT, () => {
  console.log(`App listening on port http://localhost:${PORT}`);
});

app.post('/register',jsonParser, async function(req, res) {

  let user = await registerUserOnAuthDB(req.body);
  if('error' in user){
    res.statusCode(401).json(user);
  }

  res.json(user);
});

app.post('/login', jsonParser, async function(req, res) {
  console.log("end point on id server hit");

  let user = await checkUserLoginOnAuthDB(req.body);
  if('error' in user){
    res.statusCode(401);
  }

  res.json(user);
});

