const path = require('path');

const pages = ['index', 'contents', 'redux', 'set-timeout', 'subrouted'];

const getEntry = pages => pages.reduce((acc, page) => ({
  ...acc,
  [page]: `./src/pages/${page}/index.js`,
}), {});

module.exports = {
  devtool: 'source-map',
  entry: getEntry(pages),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public/pages'),
  },
  optimization: {
    minimize: false
  },
  resolve: {
    extensions: ['.js'],
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js?/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
