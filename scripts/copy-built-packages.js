const path = require('path');
const cpFile = require('cp-file');

const packages = [
  'msinnes-dom',
  'msinnes-babel-plugin-dom-jsx',
  'msinnes-babel-preset-dom-jsx',
  'msinnes-dom-router',
  'msinnes-dom-redux-light',
  'msinnes-dom-server',
  'msinnes-dom-testing-library',
];

async function loadFile(name) {
  await cpFile(
    path.resolve(__dirname, `../@packages/${name}/${name}-v0.0.0.tgz`),
    path.resolve(__dirname, `../${name}-v0.0.0.tgz`),
    { overwrite: true }
  ).on('progress', console.log);
  console.log('Finished copying:', name);
}

async function loadFiles() {
  const promises = packages.map(async package => {
    await loadFile(package);
  });
  await Promise.all(promises);
  console.log('Files copied');
  process.exit();
}

try {
  loadFiles();
} catch (e) {
  console.error('Something went wrong while copying files');
  console.log(e);
  process.exit(1);
}