module.exports = () => ({
  presets: [[require('@babel/preset-env'), { targets: { node: 'current' }}]],
  plugins: [require('@msinnes/babel-plugin-dom-jsx')],
});
