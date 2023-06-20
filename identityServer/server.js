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

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

