const { Router } = require('express');

const { renderToString } = require('@msinnes/dom-server');
const { createStore, StoreProvider } = require('@msinnes/dom-redux-light');

const renderPage = require('../renderPage');

const { App, reducer } = require('../pages/fetch/App');
const store = createStore(reducer);

const router = new Router();

router.use((req, res) => {
  const html = renderToString((
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  ), {
    fetch: (req, res) => {
      res.text('name');
      res.close();
    },
  });
  const page = renderPage('fetch', html, store.getState());
  res.send(page);
});

exports.route = '/fetch';
exports.router = router;