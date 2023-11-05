module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    quotes: 'off',
    'no-extra-semi': 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'none',
        spaceInParens: 'always',
        useTabs: false,
        semi: false
      }
    ]
  }
}