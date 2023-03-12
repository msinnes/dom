module.exports = {
  env: {
    browser: true,
    node: true
  },
  parser: "@babel/eslint-parser",
  rules: {
    "comma-dangle": ["error", "only-multiline"],
    "comma-spacing": "error",
    "comma-style": ["error", "last"],
    "eol-last": ["error", "always"],
    eqeqeq: "error",
    "no-extra-semi": "error",
    "no-irregular-whitespace": "error",
    "no-trailing-spaces": "error",
    "no-unreachable": "error",
    "no-unused-vars": "error",
    "no-whitespace-before-property": "error",
    semi: ["error", "always"],
  },
};