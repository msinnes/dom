import * as DOM from '@msinnes/dom';
import { createStore, StoreProvider } from '@msinnes/dom-redux-light';

import { App, reducer } from './App';

const store = createStore(reducer, window.__PRELOADED_STATE__);

delete window.__PRELOADED_STATE__;

DOM.createRef(document.body).hydrate(
  <StoreProvider store={store}>
    <App />
  </StoreProvider>
);