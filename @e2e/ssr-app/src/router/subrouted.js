const { Router } = require('express');

const { renderToScreen } = require('@msinnes/dom-server');

const renderPage = require('../renderPage');

const { App } = require('../pages/subrouted/App');

const router = new Router();

const getFullUrl = (req, port) => {
  const protocol = req.protocol;
  const host = req.hostname === 'localhost' ? 'localhost:8080' : req.hostname;
  const url = req.originalUrl;
  return `${protocol}://${host}${url}`;
};

router.use((req, res) => {
  const originalUrl = getFullUrl(req);
  const { html, url } = renderToScreen(<App />, { url: originalUrl });
  if (url !== originalUrl) {
    res.redirect(301, url);
  } else {
    const page = renderPage('subrouted', html);
    res.send(page);
  }
});

exports.route = '/subrouted*';
exports.router = router;