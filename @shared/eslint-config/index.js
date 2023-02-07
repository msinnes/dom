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
    semi: ["error", "always"],
  },
};