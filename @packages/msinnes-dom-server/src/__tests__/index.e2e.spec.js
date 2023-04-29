import * as Dom from '@msinnes/dom';

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
    const html = api.renderToString(Dom.createElement('div'));
    expect(html).toEqual('<div></div>');
  });

  it('should render a function component to the dom', () => {
    const App = () => 'text';
    const html = api.renderToString(Dom.createElement(App));
    expect(html).toEqual('text');
  });

  it('should render a class component to the dom', () => {
    class App extends Dom.Component {
      render() {
        return 'text';
      }
    }
    const html = api.renderToString(Dom.createElement(App));
    expect(html).toEqual('text');
  });

  it('should render an array of elements to the dom', () => {
    const html = api.renderToString([
      Dom.createElement('div', {}, ['text 1']),
      Dom.createElement('div', {}, ['text 2']),
    ]);
    expect(html).toEqual('<div>text 1</div><div>text 2</div>');
  });

  it('should render an array of function elements to the dom', () => {
    const Comp1 = () => Dom.createElement('div', {}, ['text 1']);
    const Comp2 = () => Dom.createElement('div', {}, ['text 2']);
    const html = api.renderToString([
      Dom.createElement(Comp1),
      Dom.createElement(Comp2),
    ]);
    expect(html).toEqual('<div>text 1</div><div>text 2</div>');
  });

  it('should render an array of class elements to the dom', () => {
    class Comp1 extends Dom.Component {
      render() {
        return Dom.createElement('div', {}, ['text 1']);
      }
    }
    class Comp2 extends Dom.Component {
      render() {
        return Dom.createElement('div', {}, ['text 2']);
      }
    }
    const html = api.renderToString([
      Dom.createElement(Comp1),
      Dom.createElement(Comp2),
    ]);
    expect(html).toEqual('<div>text 1</div><div>text 2</div>');
  });

  it('should render a class component that returns a fragment', () => {
    class Comp extends Dom.Component {
      render() {
        return [
          Dom.createElement('div', {}, ['text 1']),
          Dom.createElement('div', {}, ['text 2']),
        ];
      }
    }
    const html = api.renderToString(Dom.createElement(Comp));
    expect(html).toEqual('<div>text 1</div><div>text 2</div>');
  });

  it('should render a component that returns a null render', () => {
    const Comp = () => null;
    const html = api.renderToString(Dom.createElement(Comp));
    expect(html).toEqual('');
  });

  it('should render a component that has expired timers by default', () => {
    const App = () => {
      const [text, setText] = Dom.useState('default text');
      Dom.useEffect(() => {
        setTimeout(() => {
          setText('async text');
        });
      }, []);
      return text;
    };
    const html = api.renderToString(Dom.createElement(App));
    expect(html).toEqual('async text');
  });

  it('should render a component with nested timers by default', () => {
    const App = () => {
      const [text, setText] = Dom.useState('default text');
      Dom.useEffect(() => {
        setTimeout(() => {
          setTimeout(() => {
            setTimeout(() => {
              setText('async text');
            });
          });
        });
      }, []);
      return text;
    };
    const html = api.renderToString(Dom.createElement(App));
    expect(html).toEqual('async text');
  });

  it('should throw an error if an infinite loop occurs', () => {
    const App = () => {
      const [text, setText] = Dom.useState('default text');
      setTimeout(() => {
        setText('async text');
      });
      return text;
    };
    expect(() => {
      api.renderToString(Dom.createElement(App));
    }).toThrow('ImplementationError: Maximum call depth exceeded for Asynchronous Processing.');
  });

  it('should throw the correct error if a hook is used asynchronously', () => {
    const App = () => {
      let text = 'text';
      setTimeout(() => {
        Dom.useEffect(() => {
          text = 'new text';
        });
      });
      return text;
    };
    expect(() => {
      api.renderToString(Dom.createElement(App));
    }).toThrow('InternalError: There is no active context on the controller');
  });

  it('should not run immediate timers if the app configuration is overridden', () => {
    const App = () => {
      const [text, setText] = Dom.useState('default text');
      Dom.useEffect(() => {
        setTimeout(() => {
          setText('async text');
        });
      }, []);
      return text;
    };
    const html = api.renderToString(Dom.createElement(App), { runExpiredTimers: false });
    expect(html).toEqual('default text');
  });
});
