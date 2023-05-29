// TODO: this should not have to be anchored to the top.
import { render } from '..';

import * as Dom from '@msinnes/dom';
import { connect, createStore, StoreProvider } from '@msinnes/dom-redux-light';


describe('render.e2e', () => {
  it('should render undefined to the dom', () => {
    const screen = render(undefined);
    expect(screen.container.innerHTML).toEqual('');
  });

  it('should render null to the dom', () => {
    const screen = render(null);
    expect(screen.container.innerHTML).toEqual('');
  });

  it('should render an empty string to the dom', () => {
    const screen = render('');
    expect(screen.container.innerHTML).toEqual('');
  });

  it('should render an empty array to the dom', () => {
    const screen = render([]);
    expect(screen.container.innerHTML).toEqual('');
  });

  it('should render a string to the dom', () => {
    const screen = render('text');
    expect(screen.container.innerHTML).toEqual('text');
  });

  it('should render an element to the dom', () => {
    const screen = render(Dom.createElement('div'));
    expect(screen.container.innerHTML).toEqual('<div></div>');
  });

  it('should render a function component to the dom', () => {
    const App = () => 'text';
    const screen = render(Dom.createElement(App));
    expect(screen.container.innerHTML).toEqual('text');
  });

  it('should render a class component to the dom', () => {
    class App extends Dom.Component {
      render() {
        return 'text';
      }
    }
    const screen = render(Dom.createElement(App));
    expect(screen.container.innerHTML).toEqual('text');
  });

  it('should render an array of elements to the dom', () => {
    const screen = render([
      Dom.createElement('div', {}, ['text 1']),
      Dom.createElement('div', {}, ['text 2']),
    ]);
    expect(screen.container.innerHTML).toEqual('<div>text 1</div><div>text 2</div>');
  });

  it('should render an array of function elements to the dom', () => {
    const Comp1 = () => Dom.createElement('div', {}, ['text 1']);
    const Comp2 = () => Dom.createElement('div', {}, ['text 2']);
    const screen = render([
      Dom.createElement(Comp1),
      Dom.createElement(Comp2),
    ]);
    expect(screen.container.innerHTML).toEqual('<div>text 1</div><div>text 2</div>');
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
    const screen = render([
      Dom.createElement(Comp1),
      Dom.createElement(Comp2),
    ]);
    expect(screen.container.innerHTML).toEqual('<div>text 1</div><div>text 2</div>');
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
    const screen = render(Dom.createElement(Comp));
    expect(screen.container.innerHTML).toEqual('<div>text 1</div><div>text 2</div>');
  });

  it('should render a component that returns a null render', () => {
    const Comp = () => null;
    const screen = render(Dom.createElement(Comp));
    expect(screen.container.innerHTML).toEqual('');
  });

  it('should render a component with setState', () => {
    class Comp extends Dom.Component {
      constructor(props) {
        super(props);

        this.state = [];
      }

      renderItems() {
        return Dom.createElement('ul', {}, [this.state.map(item => ({ signature: 'li', children: [item] }))]);
      }

      click() {
        this.setState([...this.state, 'item ' + (this.state.length + 1)]);
      }

      render() {
        return [
          this.state.length ? this.renderItems() : null,
          Dom.createElement('button', { onclick: this.click.bind(this) }, ['Add Item']),
        ];
      }
    }
    const screen = render(Dom.createElement(Comp));
    expect(screen.container.innerHTML).toEqual('<button>Add Item</button>');
    screen.container.firstChild.click();
    expect(screen.container.innerHTML).toEqual('<ul><li>item 1</li></ul><button>Add Item</button>');
    screen.container.firstChild.nextSibling.click();
    expect(screen.container.innerHTML).toEqual('<ul><li>item 1</li><li>item 2</li></ul><button>Add Item</button>');
  });

  it('should render a component with a useState hook', () => {
    const HookedApp = () => {
      const [state, setState] = Dom.useState(0);
      const incrementState = () => {
        setState(state + 1);
      };
      return Dom.createElement('button', {
        onclick: incrementState,
      }, ['Click ' + state]);
    };
    const screen = render(Dom.createElement(HookedApp));
    expect(screen.container.innerHTML).toEqual('<button>Click 0</button>');
    screen.container.firstChild.click();
    expect(screen.container.innerHTML).toEqual('<button>Click 1</button>');
    screen.container.firstChild.click();
    expect(screen.container.innerHTML).toEqual('<button>Click 2</button>');
  });
});

describe('text queries', () => {
  let screen;
  beforeEach(() => {
    screen = render(Dom.createElement('div', {}, [
      Dom.createElement('span', {}, ['duplicate']),
      Dom.createElement('span', {}, ['query']),
      Dom.createElement('span', {}, ['duplicate']),
    ]));
  });

  describe('getByText', () => {
    it('should get a single element if one is found', () => {
      const elem = screen.getByText('query');
      expect(elem).toBe(screen.container.firstChild.firstChild.nextSibling);
    });

    it('should throw an error if no results are found', () => {
      expect(() => {
        screen.getByText();
      }).toThrow('getByText did not find any results');
    });

    it('should throw an error if more than one result is found', () => {
      expect(() => {
        screen.getByText('duplicate');
      }).toThrow('getByText found more than one result');
    });
  });

  describe('getAllByText', () => {
    it('should return an array of found elements', () => {
      let elems = screen.getAllByText('duplicate');
      expect(elems.length).toEqual(2);
      expect(elems[0]).toBe(screen.container.firstChild.firstChild);
      expect(elems[1]).toBe(screen.container.firstChild.firstChild.nextSibling.nextSibling);
      elems = screen.getAllByText('query');
      expect(elems[0]).toBe(screen.container.firstChild.firstChild.nextSibling);
    });

    it('should throw an error if no results are found', () => {
      expect(() => {
        screen.getAllByText();
      }).toThrow('getAllByText did not find any results');
    });
  });

  describe('queryAllByText', () => {
    it('should return an array of found elements', () => {
      let elems = screen.queryAllByText('duplicate');
      expect(elems.length).toEqual(2);
      expect(elems[0]).toBe(screen.container.firstChild.firstChild);
      expect(elems[1]).toBe(screen.container.firstChild.firstChild.nextSibling.nextSibling);
      elems = screen.queryAllByText('query');
      expect(elems[0]).toBe(screen.container.firstChild.firstChild.nextSibling);
    });

    it('should return an empty array if no results are found', () => {
      const results = screen.queryAllByText();
      expect(results.length).toEqual(0);
    });
  });
});

describe('timers', () => {
  describe('timeouts', () => {
    it('should run an immediate timer', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text');
          });
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('async text');
    });

    it('should clear nested setTimeout calls', () => {
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
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('async text');
    });

    it('should process a sequence of timeouts utilizing the play functionality', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text 1');
            setTimeout(() => {
              setText('async text 2');
              setTimeout(() => {
                setText('async text 3');
              }, 1);
            }, 1);
          }, 1);
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.play();
      expect(screen.container.innerHTML).toEqual('async text 1');
      screen.time.play();
      expect(screen.container.innerHTML).toEqual('async text 2');
      screen.time.play();
      expect(screen.container.innerHTML).toEqual('async text 3');
    });

    it('should process a sequence of timeouts utilizing the play functionality with parameters passed', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text 1');
            setTimeout(() => {
              setText('async text 2');
              setTimeout(() => {
                setText('async text 3');
              }, 10);
            }, 10);
          }, 10);
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.play();
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.play(10);
      expect(screen.container.innerHTML).toEqual('async text 1');
      screen.time.play(30);
      expect(screen.container.innerHTML).toEqual('async text 3');
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
        render(Dom.createElement(App));
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
        render(Dom.createElement(App));
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
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('default text');
    });

    it('should not execute a collection of timers when play is called if the app configuration is overridden', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text 1');
            setTimeout(() => {
              setText('async text 2');
              setTimeout(() => {
                setText('async text 3');
              }, 1);
            }, 1);
          }, 1);
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.play();
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.play();
      expect(screen.container.innerHTML).toEqual('default text');
    });

    it('should allow the user to process expired timers one by one', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text 1');
            setTimeout(() => {
              setText('async text 2');
              setTimeout(() => {
                setText('async text 3');
              }, 1);
            }, 1);
          }, 1);
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.play(1);
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('async text 1');
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('async text 1');
      screen.time.play(1);
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('async text 2');
      screen.time.play(1);
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('async text 3');
    });

    it('should stack parallel timers and run them one by one', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text 1');
          }, 2);
        }, []);
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text 2');
          });
        }, []);
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text 3');
          }, 1);
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.play(2);
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('async text 2');
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('async text 3');
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('async text 1');
    });

    it('should allow the user to process expired timers by a batch', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text 1');
            setTimeout(() => {
              setText('async text 2');
              setTimeout(() => {
                setText('async text 3');
              }, 1);
            }, 1);
          }, 1);
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.play(1);
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.run();
      expect(screen.container.innerHTML).toEqual('async text 1');
      screen.time.run();
      expect(screen.container.innerHTML).toEqual('async text 1');
      screen.time.play(1);
      screen.time.run();
      expect(screen.container.innerHTML).toEqual('async text 2');
      screen.time.play(1);
      screen.time.run();
      expect(screen.container.innerHTML).toEqual('async text 3');
    });

    it('should stack parallel timers and run them as a batch', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text 1');
          }, 2);
        }, []);
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text 2');
          });
        }, []);
        Dom.useEffect(() => {
          setTimeout(() => {
            setText('async text 3');
          }, 1);
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.play(2);
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.run();
      expect(screen.container.innerHTML).toEqual('async text 1');
    });
  });

  describe('intervals', () => {
    it('should run an immediate interval', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setInterval(() => {
            setText('async text');
          });
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('async text');
    });

    it('should run nested intervals', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setInterval(() => {
            setInterval(() => {
              setText('async text');
            });
          });
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('async text');
    });

    it('should only execute intervals once per tick', () => {
      let idx = 0;
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setInterval(() => {
            setText(`async text ${idx++}`);
          });
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('async text 0');
      screen.time.run();
      expect(screen.container.innerHTML).toEqual('async text 0');
      screen.time.play();
      expect(screen.container.innerHTML).toEqual('async text 1');
      screen.time.run();
      expect(screen.container.innerHTML).toEqual('async text 1');
    });

    it('should execute parallel intervals', () => {
      let idx1 = 0;
      let idx2 = 0;
      const App = () => {
        const [text1, setText1] = Dom.useState('default text');
        const [text2, setText2] = Dom.useState('default text');
        Dom.useEffect(() => {
          setInterval(() => {
            setText1(`async text ${idx1++}`);
          });
        }, []);

        Dom.useEffect(() => {
          setInterval(() => {
            setText2(`async text ${idx2++}`);
          }, 2);
        }, []);
        return Dom.createElement('div', {}, [
          Dom.createElement('p', {}, [text1]),
          Dom.createElement('p', {}, [text2]),
        ]);
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('<div><p>async text 0</p><p>default text</p></div>');
      screen.time.play();
      expect(screen.container.innerHTML).toEqual('<div><p>async text 1</p><p>default text</p></div>');
      screen.time.play();
      expect(screen.container.innerHTML).toEqual('<div><p>async text 2</p><p>async text 0</p></div>');
      screen.time.play();
      expect(screen.container.innerHTML).toEqual('<div><p>async text 3</p><p>async text 0</p></div>');
      screen.time.play();
      expect(screen.container.innerHTML).toEqual('<div><p>async text 4</p><p>async text 1</p></div>');
    });

    it('should throw the correct error if a hook is used asynchronously', () => {
      const App = () => {
        let text = 'text';
        setInterval(() => {
          Dom.useEffect(() => {
            text = 'new text';
          });
        });
        return text;
      };
      expect(() => {
        render(Dom.createElement(App));
      }).toThrow('InternalError: There is no active context on the controller');
    });

    it('should not run immediate timers if the app configuration is overridden', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setInterval(() => {
            setText('async text');
          });
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('default text');
    });

    it('should manually run the next timer', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setInterval(() => {
            setText('async text');
          });
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('async text');
    });

    it('should manually run batch timers', () => {
      const App = () => {
        const [text1, setText1] = Dom.useState('default text');
        const [text2, setText2] = Dom.useState('default text');
        Dom.useEffect(() => {
          setInterval(() => {
            setText1('async text 1');
          });
        }, []);

        Dom.useEffect(() => {
          setInterval(() => {
            setText2('async text 2');
          });
        }, []);
        return Dom.createElement('div', {}, [
          Dom.createElement('p', {}, [text1]),
          Dom.createElement('p', {}, [text2]),
        ]);
      };
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>default text</p></div>');
      screen.time.run();
      expect(screen.container.innerHTML).toEqual('<div><p>async text 1</p><p>async text 2</p></div>');
    });

    it('should run an interval sequence manually', () => {
      const App = () => {
        const [text1, setText1] = Dom.useState('default text');
        const [text2, setText2] = Dom.useState('default text');
        Dom.useEffect(() => {
          setInterval(() => {
            setText1('async text 1');
          }, 1);
        }, []);

        Dom.useEffect(() => {
          setInterval(() => {
            setText2('async text 2');
          }, 2);
        }, []);
        return Dom.createElement('div', {}, [
          Dom.createElement('p', {}, [text1]),
          Dom.createElement('p', {}, [text2]),
        ]);
      };
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>default text</p></div>');
      screen.time.run();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>default text</p></div>');
      screen.time.tick();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>default text</p></div>');
      screen.time.run();
      expect(screen.container.innerHTML).toEqual('<div><p>async text 1</p><p>default text</p></div>');
      screen.time.tick();
      screen.time.run();
      expect(screen.container.innerHTML).toEqual('<div><p>async text 1</p><p>async text 2</p></div>');
    });
  });

  describe('animationFrames', () => {
    it('should render an animationFrame', () => {
      const App = () => {
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          requestAnimationFrame(() => {
            setText('async text');
          });
        }, []);
        return text;
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.play(16);
      expect(screen.container.innerHTML).toEqual('async text');
    });

    it('should cancal an animationFrame', () => {
      const App = () => {
        const [frameId, setFrameId] = Dom.useState();
        const [text, setText] = Dom.useState('default text');
        Dom.useEffect(() => {
          setFrameId(requestAnimationFrame(() => {
            setText('async text');
          }));
        }, []);
        // settingFrameId will trigger a re-render, and this will clear the animationFrame request
        Dom.useEffect(() => {
          if (frameId) {
            cancelAnimationFrame(frameId);
            setFrameId();
          }
        }, [frameId]);
        return text;
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('default text');
      screen.time.play(16);
      expect(screen.container.innerHTML).toEqual('default text');
    });
  });

  describe('composite', () => {
    it('should render a screen with timeouts and intervals', () => {
      const App = () => {
        const [text1, setText1] = Dom.useState('default text');
        const [text2, setText2] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText1('async text 1');
          });
        }, []);

        Dom.useEffect(() => {
          setInterval(() => {
            setText2('async text 2');
          });
        }, []);
        return Dom.createElement('div', {}, [
          Dom.createElement('p', {}, [text1]),
          Dom.createElement('p', {}, [text2]),
        ]);
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('<div><p>async text 1</p><p>async text 2</p></div>');
    });

    it('should play a screen with timeouts and intervals', () => {
      let i = 0;
      const App = () => {
        const [text1, setText1] = Dom.useState('default text');
        const [text2, setText2] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText1('async text');
          }, 5);
        }, []);

        Dom.useEffect(() => {
          setInterval(() => {
            setText2(`async text ${i++}`);
          });
        }, []);
        return Dom.createElement('div', {}, [
          Dom.createElement('p', {}, [text1]),
          Dom.createElement('p', {}, [text2]),
        ]);
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>async text 0</p></div>');
      screen.time.play(5);
      expect(screen.container.innerHTML).toEqual('<div><p>async text</p><p>async text 5</p></div>');
    });

    it('should play a screen with timeouts and intervals', () => {
      let i = 0;
      const App = () => {
        const [text1, setText1] = Dom.useState('default text');
        const [text2, setText2] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText1('async text');
          }, 5);
        }, []);

        Dom.useEffect(() => {
          setInterval(() => {
            setText2(`async text ${i++}`);
          });
        }, []);

        return Dom.createElement('div', {}, [
          Dom.createElement('p', {}, [text1]),
          Dom.createElement('p', {}, [text2]),
        ]);
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>async text 0</p></div>');
      screen.time.play(5);
      expect(screen.container.innerHTML).toEqual('<div><p>async text</p><p>async text 5</p></div>');
    });

    it('should manually tick timeouts and intervals', () => {
      let i = 0;
      const App = () => {
        const [text1, setText1] = Dom.useState('default text');
        const [text2, setText2] = Dom.useState('default text');
        Dom.useEffect(() => {
          setTimeout(() => {
            setText1('async text');
          }, 5);
        }, []);

        Dom.useEffect(() => {
          setInterval(() => {
            setText2(`async text ${i++}`);
          });
        }, []);
        return Dom.createElement('div', {}, [
          Dom.createElement('p', {}, [text1]),
          Dom.createElement('p', {}, [text2]),
        ]);
      };
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>default text</p></div>');
      screen.time.tick();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>default text</p></div>');
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>async text 0</p></div>');
      screen.time.tick();
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>async text 1</p></div>');
      screen.time.tick();
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>async text 2</p></div>');
      screen.time.tick();
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>async text 3</p></div>');
      screen.time.tick();
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>async text</p><p>async text 3</p></div>');
      screen.time.tick();
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>async text</p><p>async text 4</p></div>');
    });

    it('should manually tick timeouts and intervals', () => {
      let i = 0;
      const App = () => {
        const [text1, setText1] = Dom.useState('default text');
        const [text2, setText2] = Dom.useState('default text');

        Dom.useEffect(() => {
          setTimeout(() => {
            setText1('async text');
          }, 5);
        }, []);

        Dom.useEffect(() => {
          setInterval(() => {
            setText2(`async text ${i++}`);
          });
        }, []);
        return Dom.createElement('div', {}, [
          Dom.createElement('p', {}, [text1]),
          Dom.createElement('p', {}, [text2]),
        ]);
      };
      const screen = render(Dom.createElement(App), { digestExpiredTimers: false });
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>default text</p></div>');
      screen.time.tick();
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>async text 0</p></div>');
      screen.time.tick();
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>async text 1</p></div>');
      screen.time.tick();
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>async text 2</p></div>');
      screen.time.tick();
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>default text</p><p>async text 3</p></div>');
      screen.time.tick();
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>async text</p><p>async text 3</p></div>');
      screen.time.tick();
      screen.time.next();
      expect(screen.container.innerHTML).toEqual('<div><p>async text</p><p>async text 4</p></div>');
    });

    it('should process timers run against the window object', () => {
      const App = () => {
        const [text1, setText1] = Dom.useState('default text');
        const [text2, setText2] = Dom.useState('default text');
        Dom.useEffect(() => {
          window.setTimeout(() => {
            setText1('async text');
          });
        }, []);

        Dom.useEffect(() => {
          window.setInterval(() => {
            setText2('async text');
          });
        }, []);
        return Dom.createElement('div', {}, [
          Dom.createElement('p', {}, [text1]),
          Dom.createElement('p', {}, [text2]),
        ]);
      };
      const screen = render(Dom.createElement(App));
      expect(screen.container.innerHTML).toEqual('<div><p>async text</p><p>async text</p></div>');
    });
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

  it('should process a fetch request', () => {
    const config = {
      fetch: (req, res) => {
        res.text(req.config.body.name);
      },
    };
    const store = createStore(reducer);
    const screen = render(Dom.createElement(StoreProvider, { store }, [
      Dom.createElement(App),
    ]), config);
    expect(screen.container.innerHTML).toEqual('name');
  });

  it('should not expose the ssr scope to the fetch request (fetch interceptors should operate in server mode)', () => {
    const config = {
      fetch: (req, res) => {
        expect(global.window).toBeUndefined();
        res.text(req.config.body.name);
      },
    };
    const store = createStore(reducer);
    const screen = render(Dom.createElement(StoreProvider, { store }, [
      Dom.createElement(App),
    ]), config);
    expect(screen.container.innerHTML).toEqual('name');
  });

  it('should not digest fetch calls if configuration is overriden', () => {
    const config = {
      digestFetch: false,
      fetch: (req, res) => {
        expect(global.window).toBeUndefined();
        res.text(req.config.body.name);
      },
    };
    const store = createStore(reducer);
    const screen = render(Dom.createElement(StoreProvider, { store }, [
      Dom.createElement(App),
    ]), config);
    expect(screen.container.innerHTML).toEqual('no name');
  });

  it('should execute a single fetch handler with screen.fetch.next', () => {
    const config = {
      digestFetch: false,
      fetch: (req, res) => {
        expect(global.window).toBeUndefined();
        res.text(req.config.body.name);
      },
    };
    const store = createStore(reducer);
    const screen = render(Dom.createElement(StoreProvider, { store }, [
      Dom.createElement(App),
    ]), config);
    expect(screen.container.innerHTML).toEqual('no name');
    screen.fetch.next();
    expect(screen.container.innerHTML).toEqual('name');
  });

  it('should execute a single fetch handler with screen.fetch.run', () => {
    const config = {
      digestFetch: false,
      fetch: (req, res) => {
        expect(global.window).toBeUndefined();
        res.text(req.config.body.name);
      },
    };
    const store = createStore(reducer);
    const screen = render(Dom.createElement(StoreProvider, { store }, [
      Dom.createElement(App),
    ]), config);
    expect(screen.container.innerHTML).toEqual('no name');
    screen.fetch.run();
    expect(screen.container.innerHTML).toEqual('name');
  });
});
