module.exports = () => ({
  presets: [[require('@babel/preset-env'), { targets: { node: 'current' }}]],
  plugins: [require('@babel/plugin-syntax-jsx'), require('@msinnes/babel-plugin-dom-jsx')],
});