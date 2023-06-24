console.log('Starting Identity Server');

const serverless = require('serverless-http');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

console.log('Loading Static Folders');
fs.readdirSync(`./public`, { withFileTypes: true })
  .filter(item => item.isDirectory())
  .forEach(folder => {
    app.use(express.static(path.join(__dirname, 'public', folder.name)));
  });

app.get('/i', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(4000, () => {
  console.log(`App listening on port http://localhost:${4000}`);
});

module.exports.handler = serverless(app);