const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { createConfig } = require('@shared/rollup-config');

module.exports = createConfig([nodeResolve({
  resolveOnly: [/@shared\/*/],
})]);
