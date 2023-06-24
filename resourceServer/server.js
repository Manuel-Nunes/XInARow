console.log('Starting Resource Server');

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const serverless = require('serverless-http');

// const serverFolder = 'resourceServer';
// const { Config } = require('../globalUtils/configManager');
// const conf = new Config(`./serverConfig.json`);
// const PORT = conf.get('serverPort');

console.log('Loading Static Folders');
// fs.readdirSync(`./public` ,{
//   withFileTypes: true 
// })
//   .filter(item => item.isDirectory())
//   .forEach(folder => {
//     app.use(express.static( path.join(__dirname,'public',folder.name)));
//   });

app.get('/register', function(req, res) {
  // res.sendFile(path.join(__dirname, 'public/views/register.html'));
  res.send({some:"thing"})
});

app.listen(3000, () => {
  console.log(`App listening on port http://localhost:${3000}`);
});

module.exports.handler = serverless(app)