/* eslint-disable no-unused-vars */
const types = require('./types.js');
const express = require('express');
/* eslint-enable no-unused-vars */

const jwt = require('jsonwebtoken');
const { Config } = require('./globalUtils/configManager');
const bcrypt = require('bcrypt');

const conf = new Config('./identityServer/secrets.json');
const salt = conf.get('RSSalt');
const hash = conf.get('RSHash');
const RSJWTSecret = conf.get('RSJWTSecret');
const algo = conf.get('algorithm');

const timeOut = 14_400_000;

/**
 * Generates a Unique Token
 * @param {express.Request} req
 * @param {*} param1
 * @returns
 */
function generateRSJWT(req) {
  let EAT = Date.now();
  EAT += timeOut;

  /** @type {types.RSTokenObject} */
  const payLoad = {
    IP: req.ip ,
    HOSTNAME: req.hostnamem,
    PROTOCAL: req.protocol,
    EAT: EAT
  };
  const token = jwt.sign(
    payLoad,
    RSJWTSecret, {
      'algorithm': algo
    }
  );

  return token;
}

function checkProvidedRSPass(pass){
  const hashedPass = bcrypt.hashSync(pass, salt);
  console.log(hash === hashedPass);
  return hash === hashedPass;
}

function timeCheckToken(token){
  try {
    const data = jwt.decode(token);
    console.log(`RS Token still valid for: ${new Date(data.EAT - Date.now()).toISOString().slice(11, 19)}`);
    return data.EAT > Date.now();
  } catch (error) {
    console.log('Invalid token provided, might be corrupted');
    return false;
  }
}

function getTokeTimeRemaining(token){
  try {
    const data = jwt.decode(token);
    return data.EAT - Date.now();
  } catch (error) {
    console.log('Invalid token provided, might be corrupted');
    return 1;
  }
}

function validateRSToken(token){
  try {
    return jwt.verify(
      token,
      RSJWTSecret,
      {
        'algorithm': algo
      }
    );
  } catch (error) {
    return false;
  }
}



module.exports = {
  generateRSJWT,
  checkProvidedRSPass,
  timeCheckToken,
  validateRSToken,
  getTokeTimeRemaining
};
