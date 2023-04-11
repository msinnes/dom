const { Router } = require('express');

const { renderToString } = require('@msinnes/dom-server');

const renderPage = require('../renderPage');

const { App } = require('../pages/subrouted/App');

const router = new Router();

router.use((req, res) => {
  const html = renderToString(<App />);
  const page = renderPage('subrouted', html);
  res.send(page);
});

exports.route = '/subrouted*';
exports.router = router;