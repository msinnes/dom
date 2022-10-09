import { createStore, StoreProvider } from '../../index';

import { App } from './App';

const store = createStore(() => {}, 'redux text');

const StoreApp = () => (
  <StoreProvider store={store}>
    <App />
  </StoreProvider>
);

export { StoreApp as App };
