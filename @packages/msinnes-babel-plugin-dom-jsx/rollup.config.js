const { nodeResolve } = require('@rollup/plugin-node-resolve');

module.exports = {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
  },
  plugins: [nodeResolve({
    resolveOnly: [/@shared\/*/],
  })],
};
