import { createElement, Component } from '@new-msinnes/dom';

import * as api from '..';

describe('e2e', () => {
  it('should render undefined to the dom', () => {
    const html = api.renderToString(undefined);
    expect(html).toEqual('');
  });

  it('should render null to the dom', () => {
    const html = api.renderToString(null);
    expect(html).toEqual('');
  });

  it('should render an empty string to the dom', () => {
    const html = api.renderToString('');
    expect(html).toEqual('');
  });

  it('should render an empty array to the dom', () => {
    const html = api.renderToString([]);
    expect(html).toEqual('');
  });

  it('should render a string to the dom', () => {
    const html = api.renderToString('text');
    expect(html).toEqual('text');
  });

  it('should render an element to the dom', () => {
    const html = api.renderToString(createElement('div'));
    expect(html).toEqual('<div></div>');
  });

  it('should render a function component to the dom', () => {
    const App = () => 'text';
    const html = api.renderToString(createElement(App));
    expect(html).toEqual('text');
  });

  it('should render a class component to the dom', () => {
    class App extends Component {
      render() {
        return 'text';
      }
    }
    const html = api.renderToString(createElement(App));
    expect(html).toEqual('text');
  });

  it('should render an array of elements to the dom', () => {
    const html = api.renderToString([
      createElement('div', {}, ['text 1']),
      createElement('div', {}, ['text 2']),
    ]);
    expect(html).toEqual('<div>text 1</div><div>text 2</div>');
  });

  it('should render an array of function elements to the dom', () => {
    const Comp1 = () => createElement('div', {}, ['text 1']);
    const Comp2 = () => createElement('div', {}, ['text 2']);
    const html = api.renderToString([
      createElement(Comp1),
      createElement(Comp2),
    ]);
    expect(html).toEqual('<div>text 1</div><div>text 2</div>');
  });

  it('should render an array of class elements to the dom', () => {
    class Comp1 extends Component {
      render() {
        return createElement('div', {}, ['text 1']);
      }
    }
    class Comp2 extends Component {
      render() {
        return createElement('div', {}, ['text 2']);
      }
    }
    const html = api.renderToString([
      createElement(Comp1),
      createElement(Comp2),
    ]);
    expect(html).toEqual('<div>text 1</div><div>text 2</div>');
  });

  it('should render a class component that returns a fragment', () => {
    class Comp extends Component {
      render() {
        return [
          createElement('div', {}, ['text 1']),
          createElement('div', {}, ['text 2']),
        ];
      }
    }
    const html = api.renderToString(createElement(Comp));
    expect(html).toEqual('<div>text 1</div><div>text 2</div>');
  });

  it('should render a component that returns a null render', () => {
    const Comp = () => null;
    const html = api.renderToString(createElement(Comp));
    expect(html).toEqual('');
  });
});