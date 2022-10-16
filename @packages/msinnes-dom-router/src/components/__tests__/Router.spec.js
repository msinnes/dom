import { Component } from '@msinnes/dom';
import { render } from '@msinnes/dom-testing-library';
import { RouterContext } from '../../RouterContext';

import { Router } from '../Router';

describe('Router', () => {
  it('should be a component', () => {
    expect(Router).toExtend(Component);
  });

  it('should render to the dom', () => {
    const screen = render(
      <Router>
        <div>Content</div>
      </Router>
    );
    expect(screen.getByText('Content')).toBeOnScreen(screen);
  });

  describe('instance', () => {
    const childRef = [];
    let instance;
    beforeEach(() => {
      instance = new Router({ children: childRef });
      instance.setState = (function (nextState) {
        this.state = nextState(this.state);
      }).bind(instance);
    });

    it('should initialize with state set to zero', () => {
      expect(instance.state).toEqual(0);
    });

    it('should have a path prop and a regex prop', () => {
      expect(instance.path).toBeUndefined();
      expect(instance.regex).toBeUndefined();
      instance = new Router({ children: [], basePath: 'path' });
      expect(instance.path).toEqual('path');
      expect(instance.regex).toEqual(/^\/path[/]?/);
    });

    describe('componentDidMount', () => {
      it('should be a function', () => {
        expect(instance.componentDidMount).toBeInstanceOf(Function);
      });

      it('should add the onPopstate method as a onPopstate handler on the window object', () => {
        global.window = {};
        const addEventListenerMock = jest.fn();
        window.addEventListener = addEventListenerMock;
        instance.componentDidMount();
        expect(addEventListenerMock).toHaveBeenCalledTimes(1);
        expect(addEventListenerMock).toHaveBeenCalledWith('popstate', instance.onPopstate);
        delete global.window;
      });
    });

    describe('navigate', () => {
      it('should be a function', () => {
        expect(instance.navigate).toBeInstanceOf(Function);
      });

      it('should call window.history.pushState and window.dispatchEvent', () => {
        global.window = {
          history: {
            pushState: jest.fn(),
          },
          dispatchEvent: jest.fn(),
          location: {
            origin: 'origin',
          },
        };
        global.PopStateEvent = function() {};
        instance.navigate('to');
        expect(window.history.pushState).toHaveBeenCalledTimes(1);
        expect(window.history.pushState.mock.calls[0][0]).toMatchObject({});
        expect(window.history.pushState.mock.calls[0][1]).toBe(null);
        expect(window.history.pushState.mock.calls[0][2]).toEqual('originto');
        expect(window.dispatchEvent).toHaveBeenCalledTimes(1);
        expect(window.dispatchEvent.mock.calls[0][0]).toBeInstanceOf(PopStateEvent);
        const stateRef = {};
        instance.navigate({
          to: 'to',
          state: stateRef,
        });
        expect(window.history.pushState).toHaveBeenCalledTimes(2);
        expect(window.history.pushState.mock.calls[0][0]).toEqual(stateRef);
        expect(window.history.pushState.mock.calls[0][1]).toBe(null);
        expect(window.history.pushState.mock.calls[0][2]).toEqual('originto');
        expect(window.dispatchEvent).toHaveBeenCalledTimes(2);
        expect(window.dispatchEvent.mock.calls[0][0]).toBeInstanceOf(PopStateEvent);
      });
    });

    describe('onPopstate', () => {
      it('should be a function', () => {
        expect(instance.onPopstate).toBeInstanceOf(Function);
      });

      it('should increment state by 1', () => {
        instance.onPopstate();
        expect(instance.state).toEqual(1);
      });
    });

    describe('render', () => {
      it('should be a function', () => {
        expect(instance.render).toBeInstanceOf(Function);
      });

      it('should return instance.props.children', () => {
        global.window = {
          location: {
            pathname: '/path/1',
          },
        };
        const instance = new Router({ children: childRef, basePath: '/path/:path' });
        const render = instance.render();
        expect(render.signature).toBe(RouterContext.Provider);
        expect(render.props.value.navigate).toBe(instance.navigate);
        expect(render.props.value.basePath).toBe(instance.regex);
        expect(render.props.value.location).toBe(window.location);
        expect(render.props.value.params).toMatchObject({ path: '1' });
        expect(render.children[0]).toBe(childRef);
        delete global.window;
      });
    });
  });
});