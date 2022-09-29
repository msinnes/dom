import { createStore } from '../createStore';

const incrementReducer = (action = {}, state = 0) => {
  if (action.type === 'increment') return ++state;
  return state;
};

describe('createStore', () => {
  it('should be a function', () => {
    expect(createStore).toBeInstanceOf(Function);
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = createStore(incrementReducer);
    });

    describe('getState', () => {
      it('should be function', () => {
        expect(instance.getState).toBeInstanceOf(Function);
      });

      it('should return the application state', () => {
        expect(instance.getState()).toEqual(0);
      });

      it('should return a pre-loaded state', () => {
        instance = createStore(incrementReducer, 1);
        expect(instance.getState()).toEqual(1);
      });
    });

    describe('dispatch', () => {
      it('should be a function', () => {
        expect(instance.dispatch).toBeInstanceOf(Function);
      });

      it('should dispatch actions', () => {
        instance.dispatch({ type: 'do nothing' });
        expect(instance.getState()).toEqual(0);
        instance.dispatch({ type: 'increment' });
        expect(instance.getState()).toEqual(1);
      });

      it('should dispatch actions to a preloaded state', () => {
        instance = createStore(incrementReducer, 1);
        instance.dispatch({ type: 'do nothing' });
        expect(instance.getState()).toEqual(1);
        instance.dispatch({ type: 'increment' });
        expect(instance.getState()).toEqual(2);
      });
    });

    describe('subscribe', () => {
      it('should be a function', () => {
        expect(instance.subscribe).toBeInstanceOf(Function);
      });

      it('should be called when an action is dispatched to the store', () => {
        const subscribeMock = jest.fn();
        instance.subscribe(subscribeMock);
        instance.dispatch({ type: 'increment' });
        expect(subscribeMock).toHaveBeenCalledTimes(1);
        expect(subscribeMock.mock.calls[0][0].getState).toBe(instance.getState);
      });
    });
  });
});