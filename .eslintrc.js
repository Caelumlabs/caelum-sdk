module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:jest/recommended',
    'plugin:jest/style',
    'airbnb'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'jest'
  ],
  rules: {
  }
}
