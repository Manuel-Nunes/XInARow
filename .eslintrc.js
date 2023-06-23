module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es2021': true,
    'node': true,
    'mocha': true,
  },
  'extends': 'eslint:recommended',
  'overrides': [],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'windows'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
    'object-property-newline': 'error',
    'object-curly-newline': [
      'error', {
        'ObjectExpression': {
          'multiline': true,
          'minProperties': 1 
        },
        'ObjectPattern': {
          'multiline': true 
        },
        'ImportDeclaration': {
          'multiline': true,
          'minProperties': 1 
        },
        'ExportDeclaration': {
          'multiline': true,
          'minProperties': 1 
        }
      }
    ],
    'array-bracket-newline': [
      'error',
      {
        'multiline': true 
      }
    ],
    'object-curly-spacing': [
      'error', 'always', {
        'arraysInObjects': true 
      }
    ],
    'space-infix-ops': 'error'
  }
};
