import { combineReducers } from '../combineReducers';

const countReducer = (action, state = 0) => {
  if (action.type === 'increment') return ++state;
  if (action.type === 'decrement') return --state;
  return state;
};

const nameReducer = (action, state = '') => {
  if (action.type === 'name') return action.name;
  return state;
};

describe('combineReducers', () => {
  it('should be a function', () => {
    expect(combineReducers).toBeInstanceOf(Function);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = combineReducers({
        count: countReducer,
        name: nameReducer,
      });
    });

    it('should be a function', () => {
      expect(instance).toBeInstanceOf(Function);
    });

    it('shold return a default state if reducers are set up right (they are in this test)', () => {
      const initialState = instance({});
      expect(initialState).toMatchObject({
        count: 0,
        name: '',
      });
    });

    it('should process an action', () => {
      let state = instance({});
      expect(state).toMatchObject({
        count: 0,
        name: '',
      });
      state = instance({ type: 'increment' }, state);
      expect(state).toMatchObject({
        count: 1,
        name: '',
      });
      state = instance({ type: 'increment' }, state);
      expect(state).toMatchObject({
        count: 2,
        name: '',
      });
      state = instance({ type: 'decrement' }, state);
      expect(state).toMatchObject({
        count: 1,
        name: '',
      });
      state = instance({ type: 'name', name: 'name' }, state);
      expect(state).toMatchObject({
        count: 1,
        name: 'name',
      });
    });
  });
});