import { StoreProvider } from '../../StoreProvider';
import { createStore } from '../../createStore';

import { itemReducer } from './reducer';
import { Content } from './Content';

const store = createStore(itemReducer);

const App = () => (
  <StoreProvider store={store}>
    <Content />
  </StoreProvider>
);

export { App };