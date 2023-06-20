import * as api from '..';

import { StoreProvider } from '../components/StoreProvider';
import { connect } from '../components/connect';
import { createStore } from '../fns/createStore';
import { combineReducers } from '../fns/combineReducers';
import { useStore } from '../hooks';

describe('api', () => {
  it('should expose the correct items', () => {
    expect(api.StoreProvider).toBe(StoreProvider);
    expect(api.connect).toBe(connect);
    expect(api.createStore).toBe(createStore);
    expect(api.combineReducers).toBe(combineReducers);
  });

  it('should expose hooks', () => {
    expect(api.useStore).toBe(useStore);
  });
});
