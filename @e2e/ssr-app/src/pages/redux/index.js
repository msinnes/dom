import { createRef } from '@new-msinnes/dom';
import { createStore, StoreProvider } from '@new-msinnes/dom-redux-light';

import { App } from './App';

const store = createStore(() => {}, window.__PRELOADED_STATE__);

delete window.__PRELOADED_STATE__;

createRef(document.body).hydrate(
  <StoreProvider store={store}>
    <App />
  </StoreProvider>
);
