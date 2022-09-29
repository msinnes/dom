import * as api from '..';

import { StoreProvider } from '../StoreProvider';
import { createStore } from '../createStore';
import { combineReducers } from '../combineReducers';
import { connect } from '../connect';

describe('api', () => {
  it('should expose the correct items', () => {
    expect(api.StoreProvider).toBeDefined();
    expect(api.StoreProvider).toBe(StoreProvider);
    expect(api.connect).toBeDefined();
    expect(api.connect).toBe(connect);
    expect(api.createStore).toBeDefined();
    expect(api.createStore).toBe(createStore);
    expect(api.combineReducers).toBeDefined();
    expect(api.combineReducers).toBe(combineReducers);
  });
});