/**
 * @typedef {Object} AuthTokenObject
 * @param {string} UserName
 * @param {number} EAT
 */

/**
 * @typedef {Object} GameSetup
 * @property {boolean} doRowCheck
 * @property {boolean} doColCheck
 * @property {boolean} doDiagonalCheck
 * @property {number} gridSideLength
 * @property {number} Xrequired
 */

/**
 * @enum {number}
 */
const gameOutCome = {
  Draw: 0,
  Player1: 1,
  Player2: 2
};

/**
 * @enum {number}
 */
const gridState = {
  empty: 0,
  Player1: 1,
  Player2: 2
};

/**
 * @typedef {gridState[][]} GameGrid
 */

module.exports = {
  gameOutCome,
  gridState
};