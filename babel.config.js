module.exports = {
  "plugins": [
    ["module-resolver", {
      "root": ["./@packages"],
      "alias": {
        "@msinnes/dom": "./@packages/msinnes-dom",
      }
    }],
  ],
  "presets": ["@babel/preset-env"],
};
