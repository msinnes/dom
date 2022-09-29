const { Router } = require('express');

const { renderToString } = require('@msinnes/dom-server');
const { createElement } = require('@msinnes/dom');

const renderPage = require('../renderPage');

const { App } = require('../pages/index/App');

const router = new Router();

router.use((req, res) => {
  const html = renderToString(<App />);
  const page = renderPage('index', html);
  res.send(page);
});

exports.route = '/';
exports.router = router;
