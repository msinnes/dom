/**
 * @jest-environment jsdom
 */
import {
  Component,
  renderApp,
  useState,
  useMemo,
  useContext,
  createContext,
  createElement,
} from '../../..';

describe('class component', () => {
  it('should render a class component with a context value', () => {
    const ctx = createContext('context value');
    class ContextComponent extends Component {
      static contextType = ctx;

      render() {
        return this.context;
      }
    }
    const render = createElement(ContextComponent);
    renderApp(render, document.body);
    setTimeout(() => {
      setTimeout(() => {
        expect(document.body.innerHTML).toEqual('context value');
      });
    });
  });
});