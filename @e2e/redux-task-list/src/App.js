import { StoreProvider, createStore } from '@new-msinnes/dom-redux-light';

import { itemReducer } from './reducer';
import { Content } from './Content';

const store = createStore(itemReducer);

const App = () => (
  <StoreProvider store={store}>
    <Content />
  </StoreProvider>
);

export { App };