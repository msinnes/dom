const path = require('path');
const fs = require('fs');

const indexFile = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf8');

const renderPage = (pageName, html, initialState) => {
  let renderedPage = indexFile
    .replace('</body>', `${html}<script src="/pages/${pageName}.js"></script></body>`);

  if (initialState) renderedPage = renderedPage.replace('</head>', `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(initialState)};</script></head>`)

  return renderedPage;
}

module.exports = renderPage;