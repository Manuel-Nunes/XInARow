console.log('Starting Identity Server');
const serverless = require('serverless-http');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const serverFolder = 'identityServer';
const { Config } = require('../globalUtils/configManager');

// const conf = new Config(`./${serverFolder}/serverConfig.json`);
// const PORT = conf.get('serverPort');

console.log('Loading Static Folders');
// fs.readdirSync(`./${serverFolder}/public` ,{
//   withFileTypes: true 
// })
//   .filter(item => item.isDirectory())
//   .forEach(folder => {
//     app.use(express.static( path.join(__dirname,'public',folder.name)));
//   });

// app.get('/i', function(req, res) {
//   res.sendFile(path.join(__dirname, '/index2.html'));
// });

app.get('/', (req,res) => {
  res.send('heys')
})

app.post('/login', (req,res) => {

})

app.listen(3000, () => {
  console.log(`App listening on port http://localhost:${3000}`);
});

module.exports.handler = serverless(app.default);