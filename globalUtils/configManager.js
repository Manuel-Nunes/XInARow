const fs = require('fs');

class Config{
  configObj = {};
  constructor(configLocation = './settings.json' ){
    this.configLocation = configLocation;
    const data = fs.readFileSync(this.configLocation, 'utf8');
    if (!data){
      console.error('Could not find config file');
      return;
    }

    this.configObj = JSON.parse(data);
  }

  /**
   * get value at the end of the chain
   * @param {string} Chain 
   * @returns Value found at the end of the chain or undefined
   */
  get(Chain){
    let clasp = this.configObj;

    const chainArr = Chain.split('.');

    for (let i = 0; i < chainArr.length; i++)
    {
      if (!clasp)
        return undefined;

      clasp = clasp[chainArr[i]];
    }
    return clasp;
  }

  /**
   * Change the value at the end of a chain
   * @param {string} Chain 
   * returns true if could be set, else false
   */
  set(Chain,value){
    let clasp = this.configObj;
    const chainArr = Chain.split('.');

    for(let i = 0; i < chainArr.length - 1 ; i++)
    {
      if (!clasp || typeof clasp !== 'object')
        return false;

      clasp = clasp[chainArr[i]];
    }
    if (!clasp || typeof clasp !== 'object')
      return false;

    clasp[chainArr[ chainArr.length-1]] = value;

    fs.writeFileSync(this.configLocation, JSON.stringify(this.configObj),);

    return true;
  }
}
module.exports = {
  Config
};