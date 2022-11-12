const { Router } = require('express');

const { renderToString } = require('@msinnes/dom-server');
const { createElement } = require('@msinnes/dom');
const { createStore, StoreProvider } = require('@msinnes/dom-redux-light');

const renderPage = require('../renderPage');

const { App } = require('../pages/redux/App');
const store = createStore(() => {}, 'redux text');

const router = new Router();

router.use((req, res) => {
  const html = renderToString(
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  );
  const page = renderPage('redux', html, 'redux text');
  res.send(page);
});

exports.route = '/redux';
exports.router = router;