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
const { DBConnect } = require('./DatabaseHandlers/DBConnect');
const jwt = require('jsonwebtoken');
const dbConnect = new DBConnect;
const { checkTokenAndRefresh } = require('../globalUtils/RSTokenManager');
const serverless = require('serverless-http');

const conf = new Config(`./${serverFolder}/serverConfig.json`);

const PORT = conf.get('serverPort');
const SKIP_ID_CHECK = conf.get('skipIDCheck');

function doUserCheck(req,res,next){
  if (!SKIP_ID_CHECK && (!req.body.memberID || !req.body.token)  )
  {
    res.redirect('/login');
    res.send();

    return;
  }

  if (!SKIP_ID_CHECK && !checkUserID(req.body.memberID,req.body.token ))
  {
    res.redirect('/login');
    res.send();

    return;
  }

  next();
}

console.log('Loading Static Folders');
fs.readdirSync(`./${serverFolder}/public` ,{
  withFileTypes: true
})
  .filter(item => item.isDirectory())
  .forEach(folder => {
    app.use(express.static( path.join(__dirname,'public',folder.name)));
  });

app.get('/register',jsonParser, function(req, res) {
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

app.get('/login',jsonParser, function(req, res) {
  res.sendFile(path.join(__dirname, 'public/views/login.html'));
});

app.get('/',jsonParser,doUserCheck, function(req, res) {
  res.sendFile(path.join(__dirname, 'public/views/login.html'));
});

app.get('/game',jsonParser,doUserCheck,( req, res)=>{
  res.sendFile(path.join(__dirname, 'public/views/game.html'));
});

app.get('/homescreen',jsonParser,doUserCheck ,( req, res)=>{
  res.sendFile(path.join(__dirname, 'public/views/homescreen.html'));
});

app.post('/game', jsonParser , doUserCheck, function (req , res){
  const { gameGrid, gameSettings,playerOne ,playerTwo } = req.body ;
  userGridPOST(gameGrid,gameSettings,playerOne, playerTwo);
  res.send('Awe posted');
});

app.post('/member/profile', jsonParser,(req, res) => {

  const {token, memberID} = req.body;
  const decoded = jwt.decode(token);

  dbConnect.Profiles(decoded.memberID).then((data) => {
    res.status(200).send(data)
  }).catch((err) => {
    res.status(500).send(err)
  })
})


app.post('/profile', jsonParser , async (req, res) => {

  const {token, profileName} = req.body

  const decoded = jwt.decode(token);

  const memberName = decoded.memberID;

  const member = await dbConnect.Member(memberName)
  const randomNumber = Math.floor(Math.random() * 10) + 1;
  await dbConnect.CreateProfile(profileName, randomNumber, member.memberID).then(() => {
    res.status(200).send({message: "success"})
  }).catch((error) => {
    console.log(error)
    res.status(500).send({message: "failed"})
  })
})

app.listen(PORT, () => {
  console.log(`App listening on port http://localhost:${PORT}`);
});

checkTokenAndRefresh();

module.exports.handler = serverless(app)
