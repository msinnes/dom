const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const babel = require('@babel/core');
const rimraf = require('rimraf');
const domJsxPlugin = require('../../@packages/msinnes-babel-plugin-dom-jsx');

const pages = ['index', 'contents', 'redux'];

const getEntry = pages => pages.reduce((acc, page) => ({
  ...acc,
  [page]: path.resolve(__dirname, `../../@e2e/ssr-app/src/pages/${page}/index.js`),
}), {});

const pageConfig = {
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
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-syntax-jsx', domJsxPlugin],
            presets: ['@babel/preset-env']
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};

const webpackCb = (err, stats) => {
  if (err || stats.hasErrors()) {
    console.log('error', err);
    console.log('stats', stats);
  }
};

const compiler = webpack(pageConfig, webpackCb);

const clean = () => {
  return new Promise((resolve, reject) => {
    rimraf(path.resolve(__dirname, './dist'), err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

const checkDir = dir => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err)
      }
      resolve(files);
    });
  });
};

const statFile = name => {
  return new Promise((resolve, reject) => {
    fs.stat(name, (err, file) => {
      if (err) {
        reject(err)
      }
      resolve(file);
    });
  });
};

const getFilesInDir = async dir => {
  let fileNames = [];
  const files = await checkDir(dir);

  for (const file of files) {
    const fName = path.resolve(dir, file);
    const stat = await statFile(fName);
    if (stat.isFile()) {
      fileNames.push(fName);
    } else if (stat.isDirectory()) {
      const childFiles = await getFilesInDir(fName);
      fileNames = fileNames.concat(childFiles);
    }
  }

  return fileNames;
};

const transformFile = file => {
  return new Promise((resolve, reject) => {
    babel.transformFile(file, {
      plugins: ['@babel/plugin-syntax-jsx', domJsxPlugin, ["module-resolver", {
        "root": ["../../@packages"],
        "alias": {
          "@msinnes/dom-server": "./@packages/msinnes-dom-server",
          "@msinnes/dom-redux-light": "./@packages/msinnes-dom-redux-light",
        }
      }]],
      presets: ['@babel/preset-env']
    }, (err, out) => {
      if (err) {
        console.log('file', file);
        reject(err);
      }
      resolve(out);
    });
  });
};

const writeFile = (destination, code) => {
  const pathParts = destination.split('/');
  const pathToFile = pathParts.slice(0, pathParts.length - 1).join('/');
  if (!fs.existsSync(pathToFile)) {
    fs.mkdirSync(pathToFile, { recursive: true });
  }
  return new Promise((resolve, reject) => {
    fs.writeFile(destination, code, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

const exec = async () => {
  await clean();
  const files = await getFilesInDir(path.resolve(__dirname, '../../@e2e/ssr-app/src'));
  for (const file of files) {
    const out = await transformFile(file);
    const [pathToFile, name] = file.split('src/');
    const destination = path.resolve(__dirname, `./dist/${name}`);
    await writeFile(destination, out.code);
  }
  require('./dist/server.js');
};
exec();
