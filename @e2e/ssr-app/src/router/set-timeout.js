const { Router } = require('express');

const { renderToString } = require('@msinnes/dom-server');

const renderPage = require('../renderPage');

const { App } = require('../pages/set-timeout/App');

const router = new Router();

router.use((req, res) => {
  const html = renderToString(<App />);
  const page = renderPage('set-timeout', html);
  res.send(page);
});

exports.route = '/set-timeout';
exports.router = router;