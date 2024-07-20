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

  it('should render a component with useRef', () => {
    const Form = () => {
      const formRef = Dom.useRef('form');
      return Dom.createElement(formRef);
    };
    const html = api.renderToString(Dom.createElement(Form));
    expect(html).toEqual('<form></form>');
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

  it('should throw an error if one happens in the render cycle', () => {
    const Comp = () => { throw new Error('My Custom Error'); };
    expect(() => {
      api.renderToString(Dom.createElement(Comp));
    }).toThrow('My Custom Error');
    expect(() => {
      api.renderToScreen(Dom.createElement(Comp));
    }).toThrow('My Custom Error');
    expect(() => {
      api.renderToStringAsync(Dom.createElement(Comp));
    }).toThrow('My Custom Error');
    expect(() => {
      api.renderToScreenAsync(Dom.createElement(Comp));
    }).toThrow('My Custom Error');
  });

  describe('timers', () => {
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
    const screen = api.renderToScreen(Dom.createElement('svg', { viewBox: '0 0 100 100', xmlns: 'http://www.w3.org/2000/svg' }, [
      Dom.createElement('a', { href: 'https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle' }, [
        Dom.createElement('circle', { cx: 50, cy: 40, r: 35 }),
      ]),
    ]));
    expect(screen.html).toEqual('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle"><circle cx="50" cy="40" r="35"></circle></a></svg>');
  });

  it('should render <animate>', () => {
    const screen = api.renderToScreen(Dom.createElement('svg', { viewBox: '0 0 100 100', xmlns: 'http://www.w3.org/2000/svg' }, [
      Dom.createElement('rect', { width: 10, height: 10 }, [
        Dom.createElement('animate', { attributeName: 'rx', values: '0;5;0', dur: '10s', repeatCount: 'indefinite' }),
      ]),
    ]));
    expect(screen.html).toEqual('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="10" height="10"><animate attributeName="rx" values="0;5;0" dur="10s" repeatCount="indefinite"></animate></rect></svg>');
  });

  it('should render <animateMotion>', () => {
    const screen = api.renderToScreen(Dom.createElement('svg', { viewBox: '0 0 200 200', xmlns: 'http://www.w3.org/2000/svg' }, [
      Dom.createElement('path', { fill: 'none', stroke: 'lightgrey', d:'M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z' }),
      Dom.createElement('circle', { r: 5, fill: 'red' }, [
        Dom.createElement('animateMotion', { dur: '10s', repeatCount: 'indefinite', path:'M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z' }),
      ]),
    ]));
    expect(screen.html).toEqual('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path fill="none" stroke="lightgrey" d="M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z"></path><circle r="5" fill="red"><animateMotion dur="10s" repeatCount="indefinite" path="M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z"></animateMotion></circle></svg>');
  });

  it('should render <animateTransform>', () => {
    const screen = api.renderToScreen(Dom.createElement('svg', { height: '120', width: '120', viewBox: '0 0 120 120', xmlns: 'http://www.w3.org/2000/svg' }, [
      Dom.createElement('polygon', { points: '60,30 90,90 30,90' }, [
        Dom.createElement('animateTransform', { attributeName: 'transform', attributeType: 'XML', type: 'rotate', from: '0 60 70', to: '360 60 70', dur: '10s', repeatCount: 'indefinite' }),
      ]),
    ]));
    expect(screen.html).toEqual('<svg xmlns="http://www.w3.org/2000/svg" height="120" width="120" viewBox="0 0 120 120"><polygon points="60,30 90,90 30,90"><animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 60 70" to="360 60 70" dur="10s" repeatCount="indefinite"></animateTransform></polygon></svg>');
  });

  it('should render <circle>', () => {
    const screen = api.renderToScreen(Dom.createElement('svg', { viewBox: '0 0 100 100', xmlns: 'http://www.w3.org/2000/svg' }, [
      Dom.createElement('circle', { cx: 50, cy: 50, r: 50 }),
    ]));
    expect(screen.html).toEqual('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"></circle></svg>');
  });

  it('should render <clipPath>', () => {
    const screen = api.renderToScreen(Dom.createElement('svg', { viewBox: '0 0 100 100', xmlns: 'http://www.w3.org/2000/svg' }, [
      Dom.createElement('clipPath', { id: 'myClip' }, [
        Dom.createElement('circle', { cx: 40, cy: 35, r: 35 }),
      ]),
      Dom.createElement('path', { id: 'heart', d: 'M10,30 A20,20,0,0,1,50,30 A20,20,0,0,1,90,30 Q90,60,50,90 Q10,60,10,30 Z' }),
      Dom.createElement('use', { 'clip-path': 'url(#myClip)', href: '#heart', fill: 'red' }),
    ]));
    expect(screen.html).toEqual('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><clipPath id="myClip"><circle cx="40" cy="35" r="35"></circle></clipPath><path id="heart" d="M10,30 A20,20,0,0,1,50,30 A20,20,0,0,1,90,30 Q90,60,50,90 Q10,60,10,30 Z"></path><use clip-path="url(#myClip)" href="#heart" fill="red"></use></svg>');
  });

  it('should render <defs>', () => {
    const screen = api.renderToScreen(Dom.createElement('svg', { viewBox: '0 0 10 10', xmlns: 'http://www.w3.org/2000/svg' }, [
      Dom.createElement('defs', {}, [
        Dom.createElement('circle', { id:'myCircle', cx: 0, cy: 0, r: 5 }),
        Dom.createElement('linearGradient', { id: 'myGradient', gradientTransform: 'rotate(90)' }, [
          Dom.createElement('stop', { offset: '20%', 'stop-color': 'gold' }),
          Dom.createElement('stop', { offset: '90%', 'stop-color': 'red' }),
        ]),
      ]),
      Dom.createElement('use', { x: 5, y: 5, href: '#myCircle', fill: 'url(\'#myGradient\')' }),
    ]));
    expect(screen.html).toEqual('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><defs><circle id="myCircle" cx="0" cy="0" r="5"></circle><linearGradient id="myGradient" gradientTransform="rotate(90)"><stop offset="20%" stop-color="gold"></stop><stop offset="90%" stop-color="red"></stop></linearGradient></defs><use x="5" y="5" href="#myCircle" fill="url(\'#myGradient\')"></use></svg>');
  });

  it('should render <desc>', () => {
    const screen = api.renderToScreen(Dom.createElement('svg', { viewBox: '0 0 10 10', xmlns: 'http://www.w3.org/2000/svg' }, [
      Dom.createElement('circle', { cx: 5, cy: 5, r: 4 }, [
        Dom.createElement('desc', {}, [
          'I\'m a circle and that description is here to demonstrate how I can be described, but is it really necessary to describe a simple circle like me?'
        ]),
      ]),
    ]));
    expect(screen.html).toEqual('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4"><desc>I\'m a circle and that description is here to demonstrate how I can be described, but is it really necessary to describe a simple circle like me?</desc></circle></svg>');
  });

  it('should render <ellipse>', () => {
    const screen = api.renderToScreen(Dom.createElement('svg', { viewBox: '0 0 200 100', xmlns: 'http://www.w3.org/2000/svg' }, [
      Dom.createElement('ellipse', { cx: 100, cy: 50, rx: 100, ry: 50 }),
    ]));
    expect(screen.html).toEqual('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><ellipse cx="100" cy="50" rx="100" ry="50"></ellipse></svg>');
  });

  it('should render <foreignObject>', () => {
    const screen = api.renderToScreen(Dom.createElement('svg', { viewBox: '0 0 200 200', xmlns: 'http://www.w3.org/2000/svg' }, [
      Dom.createElement('style', {}, ['div { color: white; font: 18px serif; height: 100%; overflow: auto; }']),
      Dom.createElement('polygon', { points: '5,5 195,10 185,185 10,195' }),
      Dom.createElement('foreignObject', { x: 20, y: 20, width: 160, height: 160 }, [
        Dom.createElement('div', { xmlns: 'http://www.w3.org/1999/xhtml' }, ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mollis mollis mi ut ultricies. Nullam magna ipsum, porta vel dui convallis, rutrum imperdiet eros. Aliquam erat volutpat.'])
      ]),
    ]));
    expect(screen.html).toEqual('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><style>div { color: white; font: 18px serif; height: 100%; overflow: auto; }</style><polygon points="5,5 195,10 185,185 10,195"></polygon><foreignObject x="20" y="20" width="160" height="160"><div xmlns="http://www.w3.org/1999/xhtml">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mollis mollis mi ut ultricies. Nullam magna ipsum, porta vel dui convallis, rutrum imperdiet eros. Aliquam erat volutpat.</div></foreignObject></svg>');
  });
});
