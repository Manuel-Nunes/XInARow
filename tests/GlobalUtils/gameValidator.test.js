const chai = require('chai') ;
const expect = chai.expect;

//Target
const { validateOutCome } = require('../../globalUtils/gameValidator');
const types = require('../../globalUtils/types');

//Mocks
const { validateOutComeMock } = require('./Mocks/gameValidatorMocks.js');

describe('Testing the gameValidator', function() {
  describe('Given validateOutCome', ()=>{
    it('Should return Player1 when doing row check on valid data',()=>{

      const res = validateOutCome(validateOutComeMock.successfulRow.gameSetup,validateOutComeMock.successfulRow.grid);

      expect(res).to.equal(types.gridState.Player1);
    });

    it('Should return Empty when doing row/col/diagonal check on valid data',()=>{

      const res = validateOutCome(validateOutComeMock.noWinner.gameSetup,validateOutComeMock.noWinner.grid);

      expect(res).to.equal(types.gridState.empty);
    });

    it('Should return Player1 when doing diag check on valid data',()=>{

      const res = validateOutCome(validateOutComeMock.successfulDiag.gameSetup,validateOutComeMock.successfulDiag.grid);

      expect(res).to.equal(types.gridState.Player1);
    });

    it('Should return Player1 when doing column check on valid data',()=>{

      const res = validateOutCome(validateOutComeMock.successfulCol.gameSetup,validateOutComeMock.successfulCol.grid);

      expect(res).to.equal(types.gridState.Player1);
    });

    it('Should return Empty when doing row/col/diagonal check on a large grid',()=>{

      const res = validateOutCome(validateOutComeMock.noWinnerLargeGrid.gameSetup,validateOutComeMock.noWinnerLargeGrid.grid);

      expect(res).to.equal(types.gridState.empty);
    });

    it('Should return Player2 when doing row check on a large grid',()=>{

      const res = validateOutCome(validateOutComeMock.hasRowLargeGrid.gameSetup,validateOutComeMock.hasRowLargeGrid.grid);

      expect(res).to.equal(types.gridState.Player2);
    });

    it('Should return Player2 when doing column check on a large grid',()=>{

      const res = validateOutCome(validateOutComeMock.hasColLargeGrid.gameSetup,validateOutComeMock.hasColLargeGrid.grid);

      expect(res).to.equal(types.gridState.Player2);
    });

    it('Should return Player1 when doing diagonal (LRTD)  check on a large grid',()=>{

      const res = validateOutCome(validateOutComeMock.hasDiagLRTDLargeGrid.gameSetup,validateOutComeMock.hasDiagLRTDLargeGrid.grid);

      expect(res).to.equal(types.gridState.Player1);
    });

    it('Should return Player1 when doing diagonal (RLTD) check on a large grid',()=>{

      const res = validateOutCome(validateOutComeMock.hasDiagRLTDLargeGrid.gameSetup,validateOutComeMock.hasDiagRLTDLargeGrid.grid);

      expect(res).to.equal(types.gridState.Player1);
    });

    it.only('Should return Player1 when row check bottom',()=>{

      const res = validateOutCome(validateOutComeMock.hasBottomRowLargeGrid.gameSetup,validateOutComeMock.hasBottomRowLargeGrid.grid);

      expect(res).to.equal(types.gridState.Player1);
    });
  });
});