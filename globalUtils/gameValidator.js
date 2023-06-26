const types = require('./types');

/**
 * validates the outcome of a match provided by the frontend
 * @param {types.GameSetup} gameSetup 
 * @param {types.GameGrid} grid 
 * @returns {types.gameOutCome} Returns an outcome depending on the Enum
 */
function validateOutCome(gameSetup, grid){
  const insideArrCheck = (start, end, row) => {
    const sVal = row[end];
    let hasFailed = false;
    for (let i = start; i <= end; i++){
      if (sVal === row[i])
      {
        if (hasFailed)
          return i - 1;
      }
      else
        hasFailed = true;
    }
    return -1;
  };

  const rowCheck = ()=>{

    const remain = gameSetup.gridSideLength - gameSetup.Xrequired;
    for (let x = 0; x < gameSetup.gridSideLength; x++)
    {
      const row = grid[x];
      for (let y = 0; y <= remain; y++){
        if (row[y + gameSetup.Xrequired - 1] === types.gridState.empty)
        {
          y += gameSetup.Xrequired;
          continue;
        }

        const rowCheckRes = insideArrCheck(y,y + gameSetup.Xrequired - 1, row);
        if ( rowCheckRes === -1)
          return row[y];
        else
          y = rowCheckRes;
      }
    }
    return types.gridState.empty;
  };

  const colCheck = ()=>{
    const buildColumn = (colIndex)=>{
      const col = [];
      for (let i = 0; i < gameSetup.gridSideLength;i++){
        col.push(grid[i][colIndex]);
      }
      return col;
    };

    const remain = gameSetup.gridSideLength - gameSetup.Xrequired;
    for (let x = 0; x < gameSetup.gridSideLength; x++)
    {
      const col = buildColumn(x);
      for (let y = 0; y <= remain; y++){
        if (col[y + gameSetup.Xrequired - 1] === types.gridState.empty)
        {
          y += gameSetup.Xrequired;
          continue;
        }

        const colCheckRes = insideArrCheck(y,y + gameSetup.Xrequired - 1, col);
        if ( colCheckRes === -1)
          return col[y];
        else
          y = colCheckRes;
      }
    }
    return types.gridState.empty;
  };

  const diagonalCheck = ()=>{
    const buildDiagonalLRTD = (x,y)=>{
      const diag = [];
      while (x < gameSetup.gridSideLength && y < gameSetup.gridSideLength )
      {
        diag.push(grid[x][y]);
        x++;
        y++;
      }
      return diag;
    };

    const buildDiagonalRLTD = (x,y)=>{
      const diag = [];
      while (x < gameSetup.gridSideLength && y >= 0 )
      {
        diag.push(grid[x][y]);
        x++;
        y--;
      }
      return diag;
    };

    const remain = gameSetup.gridSideLength - gameSetup.Xrequired;
    let arr = [];
    for (let x = 0; x <= remain; x++)
    {
      arr = buildDiagonalLRTD(0,x);
      const innerRemain = arr.length - gameSetup.Xrequired;
      for (let y = 0; y <= innerRemain; y++){
        if (arr[y + gameSetup.Xrequired - 1] === types.gridState.empty)
        {
          y += gameSetup.Xrequired;
          continue;
        }

        const colCheckRes = insideArrCheck(y,y + gameSetup.Xrequired - 1, arr);
        if ( colCheckRes === -1)
          return arr[y];
        else
          y = colCheckRes;
      }
    }

    for (let x = 1; x <= remain; x++)
    {
      arr = buildDiagonalLRTD(x,0);
      const innerRemain = arr.length - gameSetup.Xrequired;

      for (let y = 0; y <= innerRemain; y++){
        if (arr[y + gameSetup.Xrequired - 1] === types.gridState.empty)
        {
          y += gameSetup.Xrequired;
          continue;
        }

        const colCheckRes = insideArrCheck(y,y + gameSetup.Xrequired - 1, arr);
        if ( colCheckRes === -1)
          return arr[y];
        else
          y = colCheckRes;
      }
    }

    for (let x = gameSetup.gridSideLength - 1; x >= remain ; x--)
    {
      arr = buildDiagonalRLTD(0,x);
      const innerRemain = arr.length - gameSetup.Xrequired;
      for (let y = 0; y <= innerRemain; y++){
        if (arr[y + gameSetup.Xrequired - 1] === types.gridState.empty)
        {
          y += gameSetup.Xrequired;
          continue;
        }

        const colCheckRes = insideArrCheck(y,y + gameSetup.Xrequired - 1, arr);
        if ( colCheckRes === -1)
          return arr[y];
        else
          y = colCheckRes;
      }
    }

    for (let x = 1; x <= remain; x++)
    {
      arr = buildDiagonalRLTD(x,gameSetup.gridSideLength - 1);
      const innerRemain = arr.length - gameSetup.Xrequired;

      for (let y = 0; y <= innerRemain; y++){
        if (arr[y + gameSetup.Xrequired - 1] === types.gridState.empty)
        {
          y += gameSetup.Xrequired;
          continue;
        }

        const colCheckRes = insideArrCheck(y,y + gameSetup.Xrequired - 1, arr);
        if ( colCheckRes === -1)
          return arr[y];
        else
          y = colCheckRes;
      }
    }

    return types.gridState.empty;
  };

  if (gameSetup.doRowCheck)
  {
    const res = rowCheck();
    if (res !== types.gridState.empty)
      return res;
  }
  
  if (gameSetup.doColCheck)
  {
    const res = colCheck();
    if (res !== types.gridState.empty)
      return res;
  }

  if (gameSetup.doDiagonalCheck)
  {
    const res = diagonalCheck();
    if (res !== types.gridState.empty)
      return res;
  }
  
  return types.gridState.empty;
}

module.exports = {
  validateOutCome
};