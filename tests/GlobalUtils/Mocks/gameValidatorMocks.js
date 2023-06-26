const types = require('../../../globalUtils/types');

const gs = types.gridState;


const validateOutComeMock = {
  successfulRow: 
  {
    grid:[
      [gs.empty,gs.empty,gs.empty,gs.empty],
      [gs.empty,gs.empty,gs.empty,gs.empty],
      [gs.Player1,gs.Player2,gs.Player1,gs.Player2],
      [gs.Player1,gs.Player1,gs.Player1,gs.Player1],
    ],
    gameSetup:{
      doRowCheck:true,
      doColCheck:false,
      doDiagonalCheck: false,
      gridSideLength: 4,
      Xrequired:4
    }
  },
  noWinner:{
    grid:[
      [gs.Player1,gs.Player2,gs.Player1,gs.Player2],
      [gs.Player1,gs.Player2,gs.Player1,gs.Player2],
      [gs.Player2,gs.Player1,gs.Player2,gs.Player1],
      [gs.Player2,gs.Player1,gs.Player2,gs.Player1],
    ],
    gameSetup:{
      doRowCheck:true,
      doColCheck:true,
      doDiagonalCheck: true,
      gridSideLength: 4,
      Xrequired:3
    }
  },
  successfulCol: 
  {
    grid:[
      [gs.empty,gs.empty,gs.Player1,gs.Player2],
      [gs.empty,gs.Player2,gs.Player1,gs.empty],
      [gs.Player2,gs.empty,gs.Player1,gs.empty],
      [gs.empty,gs.empty,gs.Player1,gs.Player2]
    ],
    gameSetup:{
      doRowCheck:false,
      doColCheck:true,
      doDiagonalCheck: false,
      gridSideLength: 4,
      Xrequired:4
    }
  },
  successfulDiag: 
  {
    grid:[
      [1,0,0,0],
      [0,1,0,0],
      [0,0,1,0],
      [0,0,0,1],
    ],
    gameSetup:{
      doRowCheck:false,
      doColCheck:false,
      doDiagonalCheck: true,
      gridSideLength: 4,
      Xrequired:4
    }
  },
  noWinnerLargeGrid:{
    grid:[
      [2,2,1,1,2,1,1],
      [2,0,0,0,0,0,1],
      [1,0,2,2,1,0,2],
      [0,2,1,0,0,2,0],
      [0,0,0,2,0,1,0],
      [1,0,2,1,1,0,2],
      [1,1,0,2,0,2,2],
    ],
    gameSetup:{
      doRowCheck:true,
      doColCheck:true,
      doDiagonalCheck: true,
      gridSideLength: 7,
      Xrequired:3
    }
  },

  hasRowLargeGrid:{
    grid:[
      [1,0,2,1,2,0,0],
      [0,1,0,1,0,2,0],
      [2,0,2,2,1,0,1],
      [0,2,1,0,0,2,0],
      [0,0,0,2,0,1,0],
      [0,1,2,1,2,0,0],
      [1,0,0,0,2,2,2],
    ],
    gameSetup:{
      doRowCheck:true,
      doColCheck:false,
      doDiagonalCheck: false,
      gridSideLength: 7,
      Xrequired:3
    }
  },

  hasColLargeGrid:{
    grid:[
      [1,0,2,1,2,0,0],
      [0,1,0,1,0,2,0],
      [2,0,2,2,1,0,1],
      [0,2,1,0,0,2,0],
      [0,0,0,2,0,1,2],
      [0,1,2,1,2,1,2],
      [1,0,0,0,2,0,2],
    ],
    gameSetup:{
      doRowCheck:false,
      doColCheck:true,
      doDiagonalCheck: false,
      gridSideLength: 7,
      Xrequired:3
    }
  },
  hasDiagLRTDLargeGrid:{
    grid:[
      [1,0,2,1,2,0,0],
      [0,1,0,1,0,2,0],
      [2,0,2,2,1,0,1],
      [0,2,1,0,0,2,0],
      [1,0,0,2,0,1,2],
      [0,1,2,1,2,1,2],
      [1,0,1,0,2,0,2],
    ],
    gameSetup:{
      doRowCheck:false,
      doColCheck:false,
      doDiagonalCheck: true,
      gridSideLength: 7,
      Xrequired:3
    }
  },
  hasDiagRLTDLargeGrid:{
    grid:[
      [1,0,2,1,2,0,0],
      [0,1,0,1,0,2,0],
      [2,0,2,2,1,0,1],
      [0,2,1,0,0,2,0],
      [0,0,1,2,0,1,2],
      [0,1,2,1,2,1,2],
      [1,0,1,0,2,0,2],
    ],
    gameSetup:{
      doRowCheck:false,
      doColCheck:false,
      doDiagonalCheck: true,
      gridSideLength: 7,
      Xrequired:3
    }
  },
  hasBottomRowLargeGrid:{
    grid:[
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,2,2,2],
      [0,0,0,1,1,1,1],
    ],
    gameSetup:{
      doRowCheck:true,
      doColCheck:false,
      doDiagonalCheck: false,
      gridSideLength: 7,
      Xrequired:4
    }
  }

};

module.exports = {
  validateOutComeMock
};