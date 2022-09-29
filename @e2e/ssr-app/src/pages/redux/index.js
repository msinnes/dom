import { hydrateApp } from '@msinnes/dom';
import { createStore, StoreProvider } from '@msinnes/dom-redux-light';

import { App } from './App';

const store = createStore(() => {}, window.__PRELOADED_STATE__);

delete window.__PRELOADED_STATE__;

hydrateApp(
  <StoreProvider store={store}>
    <App />
  </StoreProvider>
);
