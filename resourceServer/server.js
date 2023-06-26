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

const conf = new Config(`./${serverFolder}/serverConfig.json`);

const PORT = conf.get('serverPort');
const SKIP_ID_CHECK = conf.get('skipIDCheck');

/**
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {*} next 
 * @returns 
 */
async function doUserCheck(req,res,next){
  console.log(req.query);

  if (!SKIP_ID_CHECK && (!req.query.memberID || !req.query.token)  )
  {
    res.redirect('/login');
    res.send();

    return;
  }

  if (!SKIP_ID_CHECK && ! (await checkUserID(req.query.memberID,req.query.token )))
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
    if (folder.name === 'Views')
      return;
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

app.get('/',jsonParser, function(req, res) {
  res.sendFile(path.join(__dirname, 'public/views/login.html'));
});

app.get('/game',jsonParser,doUserCheck,( req, res)=>{
  res.sendFile(path.join(__dirname, 'public/views/game.html'));
});

app.get('/homescreen',jsonParser,doUserCheck ,( req, res)=>{
  
  res.sendFile(path.join(__dirname, 'public/views/homescreen.html'));
  // res.render(path.join(__dirname, 'public/views/homescreen.html'));

});

app.post('/game', jsonParser , doUserCheck, function (req , res){
  const { 
    gameGrid,
    gameSettings,
    profile1 ,
    profile2,
    winner,

  } = req.body ;
  
  console.log('Game is being saved');
  
  res.send(userGridPOST(gameGrid,gameSettings,profile1, profile2,winner,req.query.memberID,));
});

app.post('/member/:memberData/profile', jsonParser, doUserCheck,(req, res) => {
  console.log('Get profiles EP was hit');
  dbConnect.Profiles(parseInt(req.params.memberData)).then((data) => {
    res.status(200).send(data);
  }).catch((err) => {
    res.status(500).send(err);
  });
});


app.post('/profile', jsonParser , async (req, res) => {

  const { token, profileName } = req.body;

  const decoded = jwt.decode(token);

  const memberName = decoded.memberID;

  const member = await dbConnect.Member(memberName);
  const randomNumber = Math.floor(Math.random() * 10) + 1;
  await dbConnect.CreateProfile(profileName, randomNumber, member.memberID).then(() => {
    res.status(200).send({
      message: 'success'
    });
  }).catch((error) => {
    console.log(error);
    res.status(500).send({
      message: 'failed'
    });
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port http://localhost:${PORT}`);
});

checkTokenAndRefresh();