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
  let error;
  const originalUrl = getFullUrl(req);
  let html, url;
  try {
    const screen = renderToScreen(<App />, { url: originalUrl });
    html = screen.html, url = screen.url;
  } catch (e) {
    error = e;
  }
  if (error) {
    if (error.message === '404 Not Found') {
      res.status(404).send(error.message);
    } else {
      throw error;
    }
  } else if (url !== originalUrl) {
    res.redirect(301, url);
  } else {
    const page = renderPage('subrouted', html);
    res.send(page);
  }
});

exports.route = '/subrouted*';
exports.router = router;