import * as DOM from '@msinnes/dom';
import { createStore, StoreProvider } from '@msinnes/dom-redux-light';

import { App } from './App';

const store = createStore(() => {}, window.__PRELOADED_STATE__);

delete window.__PRELOADED_STATE__;

DOM.createRef(document.body).hydrate(
  <StoreProvider store={store}>
    <App />
  </StoreProvider>
);
