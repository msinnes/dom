// TODO: this should not have to be anchored to the top.
import * as api from '..';

import * as Dom from '@msinnes/dom';
import { connect, createStore, StoreProvider } from '@msinnes/dom-redux-light';

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
    const html = api.renderToString(Dom.createElement(App), { digestExpiredTimers: false });
    expect(html).toEqual('default text');
  });

  it('should not run any intervals with a delay', () => {
    const App = () => {
      const [text, setText] = Dom.useState('default text');
      Dom.useEffect(() => {
        setInterval(() => {
          setText('async text');
        }, 10);
      }, []);
      return text;
    };
    const html = api.renderToString(Dom.createElement(App));
    expect(html).toEqual('default text');
  });

  it('should only run an interval once if it has no delay', () => {
    const App = () => {
      const [text, setText] = Dom.useState('default text');
      Dom.useEffect(() => {
        setInterval(() => {
          setText('async text');
        });
      }, []);
      return text;
    };
    const html = api.renderToString(Dom.createElement(App));
    expect(html).toEqual('async text');
  });

  it('should execute multiple intervals', () => {
    const App = () => {
      const [text, setText] = Dom.useState('default text');
      Dom.useEffect(() => {
        setInterval(() => {
          setText('async text 1');
        });
      }, []);

      Dom.useEffect(() => {
        setInterval(() => {
          setText('async text 2');
        }, 10);
      }, []);

      Dom.useEffect(() => {
        setInterval(() => {
          setText('async text 3');
        }, 0);
      }, []);
      return text;
    };
    const html = api.renderToString(Dom.createElement(App));
    expect(html).toEqual('async text 3');
  });

  it('should not execute an interval if digestExpiredTimers is configured as false', () => {
    const App = () => {
      const [text, setText] = Dom.useState('default text');
      Dom.useEffect(() => {
        setInterval(() => {
          setText('async text');
        });
      }, []);
      return text;
    };
    const html = api.renderToString(Dom.createElement(App), { digestExpiredTimers: false });
    expect(html).toEqual('default text');
  });

  it('should run intervals and timeouts together', () => {
    const App = () => {
      const [text1, setText1] = Dom.useState('default text 1');
      const [text2, setText2] = Dom.useState('default text 2');
      Dom.useEffect(() => {
        setInterval(() => {
          setText1('async text 1');
        });
      }, []);
      Dom.useEffect(() => {
        setTimeout(() => {
          setText2('async text 2');
        });
      }, []);
      return Dom.createElement('div', {}, [
        Dom.createElement('p', {}, [text1]),
        Dom.createElement('p', {}, [text2]),
      ]);
    };
    const html = api.renderToString(Dom.createElement(App));
    expect(html).toEqual('<div><p>async text 1</p><p>async text 2</p></div>');
  });

  it('should not render any animationFrames', () => {
    const App = () => {
      const [text, setText] = Dom.useState('default text');
      Dom.useEffect(() => {
        requestAnimationFrame(() => {
          setText('async text');
        });
      }, []);
      return text;
    };
    const html = api.renderToString(Dom.createElement(App));
    expect(html).toEqual('default text');
  });

  describe('fetch', () => {
    const getName = () => fetch('url', { body: { name: 'name' } });
    const setNameAction = name => {
        return ({
          type: 'SET_NAME',
          name,
        });
    };

    const reducer = (action, state = '') => {
      if (action.type = 'SET_NAME') return action.name;
      return state;
    };

    const Name = ({ name, setName }) => {
      Dom.useEffect(() => {
        getName().then(data => data.text()).then(name => setName(name));
      }, []);
      return name && name.length ? name : 'no name';
    };
    const ConnectedName = connect(state => ({
      name: state,
    }), dispatch => ({
      setName: name => dispatch(setNameAction(name)),
    }))(Name);

    const App = () => {
      return Dom.createElement(ConnectedName);
    };

    it('should render a basic fetch with redux', () => {
      const config = {
        fetch: (req, res) => {
          if (req.url) res.text(req.config.body.name);
          res.close();
        },
      };

      const store = createStore(reducer);
      const html = api.renderToString(Dom.createElement(StoreProvider, { store }, [
        Dom.createElement(App),
      ]), config);
      expect(html).toEqual('name');
    });

    it('should not expose the ssr scope to the fetch request (fetch interceptors should operate in server mode)', () => {
      const config = {
        fetch: (req, res) => {
          expect(global.window).toBeUndefined();
          res.text(req.config.body.name);
          res.close();
        },
      };

      const store = createStore(reducer);
      const html = api.renderToString(Dom.createElement(StoreProvider, { store }, [
        Dom.createElement(App),
      ]), config);
      expect(html).toEqual('name');
    });

    it('should not digest fetch calls if configuration is overriden', () => {
      const config = {
        digestFetch: false,
        fetch: (req, res) => {
          expect(global.window).toBeUndefined();
          res.text(req.config.body.name);
          res.close();
        },
      };

      const store = createStore(reducer);
      const html = api.renderToString(Dom.createElement(StoreProvider, { store }, [
        Dom.createElement(App),
      ]), config);
      expect(html).toEqual('no name');
    });

    it('should render a string asynchronously', async () => {
      const html = await api.renderToStringAsync(undefined);
      expect(html).toEqual('');
    });

    it('should render a screen asynchronousely', async () => {
      const MiniAsyncApp = () => {
        const [name, setName] = Dom.useState();
        if (!name) fetch('name').then(data => data.text()).then(setName);
        return name;
      };
      const screen = await api.renderToScreenAsync(Dom.createElement(MiniAsyncApp), {
        fetch: (req, res) => {
          setTimeout(() => {
            res.text('async name');
            res.close();
          });
        },
      });
      expect(screen.html).toEqual('async name');
    });

    it('should resolve a string promise if fetch is not being digested', async () => {
      const MiniAsyncApp = () => {
        const [name, setName] = Dom.useState('default text');
        if (!name) fetch('name').then(data => data.text()).then(setName);
        return name;
      };
      const html = await api.renderToStringAsync(Dom.createElement(MiniAsyncApp), {
        digestFetch: false,
        fetch: (req, res) => {
          setTimeout(() => {
            res.text('async name');
            res.close();
          });
        },
      });
      expect(html).toEqual('default text');
    });

    it('should resolve a screen promise if fetch is not being digested', async () => {
      const MiniAsyncApp = () => {
        const [name, setName] = Dom.useState('default text');
        if (!name) fetch('name').then(data => data.text()).then(setName);
        return name;
      };
      const screen = await api.renderToScreenAsync(Dom.createElement(MiniAsyncApp), {
        digestFetch: false,
        fetch: (req, res) => {
          setTimeout(() => {
            res.text('async name');
            res.close();
          });
        },
      });
      expect(screen.html).toEqual('default text');
    });
  });
});

// TODO: (svg-update) add e2e tests for svg components
describe('e2e.svg', () => {
  it('should support <a>', () => {
    const screen = api.renderToScreen(Dom.createElement('svg', { viewBox: '0 0 100 100' }, [
      Dom.createElement('a', { href: 'https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle' }, [
        Dom.createElement('circle', { cx: 50, cy: 40, r: 35 }),
      ]),
    ]));
    expect(screen.html).toEqual('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle"><circle cx="50" cy="40" r="35"></circle></a></svg>');
  });

  it('should render <animate>', () => {
    const screen = api.renderToScreen(Dom.createElement('svg', { viewBox: '0 0 100 100' }, [
      Dom.createElement('rect', { width: 10, height: 10 }, [
        Dom.createElement('animate', { attributeName: 'rx', values: '0;5;0', dur: '10s', repeatCount: 'indefinite' }),
      ]),
    ]));
    expect(screen.html).toEqual('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10"><animate attributeName="rx" values="0;5;0" dur="10s" repeatCount="indefinite"></animate></rect></svg>');
  });
});
