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
].map(name => {
  const { version } = require(`../@packages/${name}/package.json`);
  return { name, version };
});

async function loadFile(name, version) {
  await cpFile(
    path.resolve(__dirname, `../@packages/${name}/${name}-v${version}.tgz`),
    path.resolve(__dirname, `../${name}-v${version}.tgz`),
    { overwrite: true }
  ).on('progress', console.log);
  console.log('Finished copying:', name);
}

async function loadFiles() {
  const promises = packages.map(async ({ name, version }) => {
    await loadFile(name, version);
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