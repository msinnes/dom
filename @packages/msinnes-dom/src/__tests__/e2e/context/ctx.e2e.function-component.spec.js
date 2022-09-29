/**
 * @jest-environment jsdom
 */
import {
  renderApp,
  useContext,
  createContext,
  createElement,
} from '../../..';

describe('function component context', () => {
  it('should render a function component with a context value', () => {
    const ctx = createContext('context value');
    const ContextFunction = () => {
      const contextValue = useContext(ctx);
      return contextValue;
    };
    const render = createElement(ContextFunction);
    renderApp(render, document.body);
    setTimeout(() => {
      setTimeout(() => {
        expect(document.body.innerHTML).toEqual('context value');
      });
    });
  });
});