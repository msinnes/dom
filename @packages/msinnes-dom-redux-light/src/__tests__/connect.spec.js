import { StoreProvider } from '../StoreProvider';
import { createStore } from '../createStore';

import { connect } from '../connect';

describe('connect', () => {
  it('should be a function', () => {
    expect(connect).toBeInstanceOf(Function);
  });

  describe('when the store is not configured', () => {
    it('should throw an error when the component tries to render', () => {
      const ConnectedComponent = connect()(() => {});
      let message;
      try {
        ConnectedComponent({});
      } catch (e) {
        message = e.message;
      }
      expect(message).toBeDefined();
      expect(message).toEqual('ImplementationError: connected components require a configured store in the component tree.');
    });
  });

  describe('when the store is configured', () => {
    let storeComponent;
    let storeChild;
    beforeEach(() => {
      const rootReducer = () => 'state';
      const store = createStore(rootReducer);
      storeComponent = new StoreProvider({ store });
      // render the store
      const storeChild = storeComponent.render();
      // render the provider to populate the storeContext
      storeChild.signature(storeChild.props);
    });

    it('should return a function that returns a function', () => {
      const fun1 = connect();
      const funComponent = fun1();
      expect(fun1).toBeInstanceOf(Function);
      expect(funComponent).toBeInstanceOf(Function);
    });

    it('should return a connected component passing through props and children', () => {
      const childRef = [];
      function BaseComponent(props) {
        return props.children;
      }
      const ConnectedBaseComponent = connect()(BaseComponent);
      const out = ConnectedBaseComponent({ children: childRef, prop1: 'prop1' });
      expect(out.signature).toBe(BaseComponent);
      expect(out.props).toMatchObject({ prop1: 'prop1' });
      expect(out.children[0]).toBe(childRef);
    });

    it('should expose the dispatch function on a component\'s props', () => {
      const childRef = [];
      function BaseComponent(props) {
        return props.children;
      }
      const ConnectedBaseComponent = connect()(BaseComponent);
      const out = ConnectedBaseComponent({ children: childRef, prop1: 'prop1' });
      expect(out.props.dispatch).toBeDefined();
      expect(out.props.dispatch).toBeInstanceOf(Function);
    });

    it('should use mapStateToProps to get data from the store', () => {
      const rootReducer = () => 'state';
      const store = createStore(rootReducer);
      new StoreProvider({ store });
      const mapStateToProps = state => ({ text: state });
      const BaseComponent = ({ text }) => text;
      const ConnectedComponent = connect(mapStateToProps)(BaseComponent);
      expect(ConnectedComponent({}).props.text).toEqual('state');
    });

    it('should use mapDispatchToProps to give connected component access to the store', () => {
      // Make a new store with a new reducer
      const rootReducer = (action, state = 'state') => {
        if (action.type === 'now') return 'next state';
        return state;
      };
      // bootstrap the store
      const store = createStore(rootReducer);
      storeComponent = new StoreProvider({ store });
      storeComponent.componentDidMount();
      storeComponent.setState = (function (nextState) {
        this.state = nextState(this.state);
      }).bind(storeComponent);
      // render the child to populate the context
      storeChild = storeComponent.render();
      storeChild.signature(storeChild.props);
      const mapStateToProps = state => ({ text: state });
      const mapDispatchToProps = dispatch => ({
        now: () => dispatch({ type: 'now' }),
      });
      const BaseComponent = ({ text }) => text;
      const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(BaseComponent);
      const now = ConnectedComponent({}).props.now;
      expect(now).toBeInstanceOf(Function);
      now();
      expect(storeComponent.state).toEqual(1);
      expect(ConnectedComponent({}).props.text).toEqual('next state');
    });

    it('should use a provided mergeProps if one is passed', () => {
      // Make a new store with a new reducer
      const rootReducer = (action, state = 'state') => {
        if (action.type === 'now') return 'next state';
        return state;
      };
      // bootstrap the store
      const store = createStore(rootReducer);
      storeComponent = new StoreProvider({ store });
      storeComponent.componentDidMount();
      storeComponent.setState = (function (nextState) {
        this.state = nextState(this.state);
      }).bind(storeComponent);
      // render the child to populate the context
      storeChild = storeComponent.render();
      storeChild.signature(storeChild.props);
      const mapStateToProps = state => ({ text: state });
      const mapDispatchToProps = dispatch => ({
        now: () => dispatch({ type: 'now' }),
      });
      // Will overwrite the text provided by application state.
      const mergeProps = (stateProps, dispatchProps, ownProps) => ({
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
      })
      const BaseComponent = ({ text }) => text;
      const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps, mergeProps)(BaseComponent);
      expect(ConnectedComponent({ text: 'overwrite' }).props.text).toEqual('overwrite');
    });
  });
});