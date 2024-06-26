module.exports = {
  extends: ['eslint:recommended', 'plugin:import/errors', 'prettier'],
  plugins: ['import'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  settings: {},
};
