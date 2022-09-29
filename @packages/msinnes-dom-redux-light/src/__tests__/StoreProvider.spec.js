import { Component } from '@msinnes/dom';

import { StoreProvider } from '../StoreProvider';

import { createStore } from '../createStore';
import { storeContext } from '../storeContext';

describe('StoreProvider', () => {
  it('should be a component', () => {
    expect(StoreProvider).toBeDefined();
    expect(StoreProvider.prototype.__proto__.constructor).toBe(Component.prototype.constructor);
  });

  describe('instance', () => {
    const childRef = [];
    let instance;
    let subscribeMock;
    let mockStore;
    beforeEach(() => {
      subscribeMock = jest.fn();
      mockStore = {
        subscribe: subscribeMock,
      };
      instance = new StoreProvider({ store: mockStore, children: childRef });
      instance.setState = (function (nextState) {
        this.state = nextState(this.state);
      }).bind(instance);
    });

    it('should initialize with state set to zero', () => {
      expect(instance.state).toEqual(0);
    });

    it('should initialize appStore as the provided props.store', () => {
      expect(instance.appStore).toBe(mockStore);
    });

    describe('componentDidMount', () => {
      it('should be a function', () => {
        expect(instance.componentDidMount).toBeInstanceOf(Function);
      });

      it('should call the subscribeMock with instance.storeSubscription', () => {
        instance.componentDidMount();
        expect(subscribeMock).toHaveBeenCalledTimes(1);
        expect(subscribeMock).toHaveBeenCalledWith(instance.storeSubscription);
      });
    });

    describe('storeSubscription', () => {
      it('should be a function', () => {
        expect(instance.storeSubscription).toBeInstanceOf(Function);
      });

      it('should increment state by 1', () => {
        instance.storeSubscription();
        expect(instance.state).toEqual(1);
      });
    });

    describe('render', () => {
      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should return a provider wrapping props.children', () => {
        const render = instance.render();
        expect(render.signature).toBe(storeContext.Provider);
        expect(render.children[0]).toBe(childRef);
      });
    });
  });
});