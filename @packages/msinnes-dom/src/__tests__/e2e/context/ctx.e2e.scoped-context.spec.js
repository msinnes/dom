/**
 * @jest-environment jsdom
 */
import {
  renderApp,
  useContext,
  createContext,
  createElement,
} from '../../..';

describe('scoped context', () => {
  it('should scope a context to the nearest provider parent', () => {
    const ctx = createContext('default value');
    const { Provider, Consumer } = ctx;
    const render = createElement('div', {}, [
      createElement(Provider, { value: 'provided value' }, [createElement(() => {
        const ctxValue = useContext(ctx);
        return createElement('span', {}, [ctxValue]);
      })]),
      createElement(Consumer, {}, [value => createElement('span', {}, [value])]),
    ]);
    renderApp(render, document.body);
    setTimeout(() => {
      setTimeout(() => {
        expect(document.body.innerHTML).toEqual('<div><span>provided value</span><span>default value</span></div>')
      });
    });
  });
});