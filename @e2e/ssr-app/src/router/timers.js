const { Router } = require('express');

const { renderToString } = require('@msinnes/dom-server');

const renderPage = require('../renderPage');

const { App } = require('../pages/timers/App');

const router = new Router();

router.use((req, res) => {
  const html = renderToString(<App />);
  const page = renderPage('timers', html);
  res.send(page);
});

exports.route = '/timers';
exports.router = router;