console.log('Starting Identity Server');
const serverless = require('serverless-http');
const express = require('express');


const app = express();


console.log('Loading Static Folders');


app.get('/', (req,res, callback) => {

  callback(null,{msg:'heyyyy'})
})

app.post('/login', (req,res) => {

})

app.listen(3000, () => {
  console.log(`App listening on port http://localhost:${3000}`);
});

module.exports.handler = serverless(app.default);