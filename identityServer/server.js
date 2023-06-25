console.log('Starting Identity Server');

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const serverFolder = 'identityServer';
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

app.get('/register', function(req, res) {
  console.log("end point on id server hit");

  let user = registerUserOnAuthDB(req.body);
  if(user.hasOwnProperty("error")){
    res.statusCode(401).json(user);
  }

  res.json(user);
});

app.get('/login', function(req, res) {
  let user = checkUserLoginOnAuthDB(req.body);
  if(user.hasOwnProperty("error")){
    res.statusCode(401);
  }

  res.json(user);
});

