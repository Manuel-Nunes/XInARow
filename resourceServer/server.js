console.log('Starting Resource Server');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const jsonParser = require('body-parser').json();
const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');
const jwt = require('jsonwebtoken');

const registerUser = require('./DatabaseHandlers/registerHandler');
const loginUser = require('./DatabaseHandlers/loginHandler');

const { Config } = require('../globalUtils/configManager');
const { DBConnect } = require('./DatabaseHandlers/DBConnect');

const { userGridPOST } = require('./endpointHandlers');
const { checkUserID } = require('./checkUserID');
const { checkTokenAndRefresh } = require('../globalUtils/RSTokenManager');
const { comboCheck } = require('../globalUtils/fileChecker');
const { isHTTPSMode } = require('../globalUtils/checkHTTPMode');

const serverFolder = 'resourceServer';
const dbConnect = new DBConnect;
const app = express();

if (!comboCheck(serverFolder))
{
  console.log('Unable to start due to missing files');
  throw new Error('Missing Files');
}

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
});

app.post('/game', jsonParser , doUserCheck, async function (req , res){
  const {
    gameGrid,
    gameSettings,
    profile1 ,
    profile2,
    winner,

  } = req.body ;

  console.log('Game is being saved');
  const resdata = await userGridPOST(gameGrid,gameSettings,profile1, profile2,winner,req.query.memberID);
  res.send(resdata);
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

if (!isHTTPSMode()){
  console.log('No Certs found in root folder... launching in HTTP mode');
  app.listen(PORT, () => {
    console.log(`App listening on port http://localhost:${PORT}`);
  });
}
else{
  https.createServer(
    {
      key: fs.readFileSync('./key.pem'),
      cert: fs.readFileSync('./cert.pem'),
    },
    app
  ).listen(PORT, () => {
    console.log(`App listening on port https://localhost:${PORT}`);
  });
}

checkTokenAndRefresh();
