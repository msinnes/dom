import * as DOM from '@msinnes/dom';

import { StoreContext } from './StoreContext';

const useStore = () => DOM.useContext(StoreContext);

const useDispatch = () => useStore().dispatch;

export { useStore, useDispatch };
