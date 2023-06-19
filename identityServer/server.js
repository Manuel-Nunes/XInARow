console.log('Starting Resource Server');

const express = require('express');
const fs = require('fs');
const path = require('path');

const { Config } = require('../globalUtils/configManager');

const conf = new Config('./resourceServer/serverConfig.json');

const PORT = conf.get('serverPort');

const app = express();

fs.readdirSync('./resourceServer\\public' ,{
  withFileTypes: true 
})
  .filter(item => item.isDirectory())
  .forEach(folder => {
    console.log(path.join(__dirname,'public',folder.name));
    app.use(express.static( path.join(__dirname,'public',folder.name)));
  });

app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`);
});