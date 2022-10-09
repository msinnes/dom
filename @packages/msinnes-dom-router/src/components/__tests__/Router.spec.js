import { Component } from '@msinnes/dom';
import { render } from '@msinnes/dom-testing-library';

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
        expect(instance.render()).toBe(childRef);
      });
    });
  });
});