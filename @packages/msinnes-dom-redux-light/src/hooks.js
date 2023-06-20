import * as DOM from '@msinnes/dom';

import { StoreContext } from './StoreContext';

const useStore = () => DOM.useContext(StoreContext);

const useDispatch = () => useStore().dispatch;

const useSelector = fn => fn(useStore().getState());

export { useStore, useDispatch, useSelector };
