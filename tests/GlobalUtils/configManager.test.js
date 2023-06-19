const chai = require('chai') ;

const { Config } = require('../../globalUtils/configManager');
const fs = require('fs');

const tempJson = require('./Mocks/testConfigBase.json');

const expect = chai.expect;
let conf;

beforeEach(()=>{
  fs.writeFileSync('tests\\GlobalUtils\\test.json', JSON.stringify(tempJson) );
  
  conf = new Config('tests\\GlobalUtils\\test.json');
});

describe('Testing the configManager', function() {
  it('should return HiThisIsTheDBURL when prompted with dbURL', ()=>{
    expect(conf.get('dbURL')).to.equal('HiThisIsTheDBURL');
  });

  it('should return 69 when prompted with myObject.myProperty.propertyProperty', ()=>{
    expect(conf.get('myObject.myProperty.propertyProperty')).to.equal(69);
  });

  it('should return true when trying to set myObject.myProperty.propertyProperty', ()=>{
    expect(conf.set('myObject.myProperty.propertyProperty',420)).to.equal(true);
    expect(conf.get('myObject.myProperty.propertyProperty')).to.equal(420);

    const temp = new Config('tests\\GlobalUtils\\test.json');
    expect(temp.get('myObject.myProperty.propertyProperty')).to.equal(420);

  });
});