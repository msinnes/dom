const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const domJsxPlugin = require('../../@packages/msinnes-babel-plugin-dom-jsx');

const configBase = {
  mode: 'development',
  module: {
    rules: [{
      test: /\.js?/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          plugins: [domJsxPlugin],
          presets: ['@babel/preset-env']
        },
      },
    }, {
      test: /\.css$/i,
      use: ["style-loader", "css-loader"],
    }],
  },
};

const baseDevServerOptions = {
  static: {
    directory: path.join(__dirname, 'public'),
  },
  compress: true,
};

const webpackCb = (err, stats) => {
  if (err || stats.hasErrors()) {
    console.log('error', err);
    console.log('stats', stats);
  }
};

const apps = [
  'auth-app',
  'effects-app',
  'hooks-app',
  'hydrate-app',
  'item-list-test-client',
  'redux-task-list',
  'router-app',
  'svg-app',
].forEach((appName, i) => {
  const compiler = webpack({
    entry: path.resolve(__dirname, `../../@e2e/${appName}/src/index.js`),
    output: {
      filename: `${appName}.js`,
      path: path.resolve(__dirname, 'dist'),
    },
    ...configBase,
  }, webpackCb);

  const appServer = new WebpackDevServer({
    ...baseDevServerOptions,
    port: 9000 + i,
    historyApiFallback: {
      index: `${appName}.html`,
    }
  }, compiler);

  appServer.start();
});
