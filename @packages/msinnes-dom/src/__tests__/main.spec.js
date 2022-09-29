/**
 * @jest-environment jsdom
 */
import { RenderableComponent } from '@internal/app/AppRenderer';
import { renderApp, hydrateApp } from '../main';
import createElement from '@internal/utils/createElement';

afterEach(() => {
  while (document.body.children.length) {
    document.body.removeChild(document.body.firstChild);
  }
});

describe('renderApp', () => {
  it('should be a function', () => {
    expect(renderApp).toBeInstanceOf(Function);
  });

  it('should render an app to the dom', done => {
    class App extends RenderableComponent {
      render() {
        return createElement('div', { innerText: 'text 1' });
      }
    }

    renderApp(createElement(App), document.body);
    setTimeout(() => {
      expect(document.body.children.length).toEqual(1);
      expect(document.body.firstChild.tagName).toEqual('DIV');
      expect(document.body.firstChild.innerText).toEqual('text 1');
      done();
    });
  });
});

describe('hydrateApp', () => {
  it('should be a function', () => {
    expect(hydrateApp).toBeInstanceOf(Function);
  });

  it('should render an app to a pre-rendered dom', done => {
    const div = document.createElement('div');
    const p = document.createElement('p');
    p.innerHTML = 'text 1';
    div.appendChild(p);
    document.body.appendChild(div);

    class App extends RenderableComponent {
      render() {
        return createElement('div', { innerText: 'text 1' });
      }
    }

    hydrateApp(createElement(App), document.body);

    setTimeout(() => {
      expect(document.body.children.length).toEqual(1);
      expect(document.body.firstChild.tagName).toEqual('DIV');
      expect(document.body.firstChild.innerText).toEqual('text 1');
      done();
    });
  });
});
