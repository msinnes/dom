/**
 * @jest-environment jsdom
 */
import { Component, createRef, createElement, useContext, useEffect, useMemo, useState, createContext } from '..';

import { infra } from '../infra';

describe('e2e.basic', () => {
  let ref;
  let timeouts;
  beforeEach(() => {
    ref = createRef(document.body);
    timeouts = useMyTimers();
  });

  afterEach(() => {
    resetMyTimers();
    while(document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    window.document.title = '';
    infra.effectService.indexes.forEach(idx => {
      infra.services.destroyInstance(idx);
    });
  });

  it('should render undefined to the dom', () => {
    ref.render(undefined);
    expect(document.body.innerHTML).toEqual('');
  });

  it('should render null to the dom', () => {
    ref.render(null);
    expect(document.body.innerHTML).toEqual('');
  });

  it('should render an empty string to the dom', () => {
    ref.render('');
    expect(document.body.innerHTML).toEqual('');
  });

  it('should render an empty array to the dom', () => {
    ref.render([]);
    expect(document.body.innerHTML).toEqual('');
  });

  it('should render a string to the dom', () => {
    ref.render('text');
    expect(document.body.innerHTML).toEqual('text');
  });

  it('should render an element to the dom', () => {
    ref.render(createElement('div'));
    expect(document.body.innerHTML).toEqual('<div></div>');
  });

  it('should render a function component to the dom', () => {
    const App = () => 'text';
    ref.render(createElement(App));
    expect(document.body.innerHTML).toEqual('text');
  });

  it('should render a class component to the dom', () => {
    class App extends Component {
      render() {
        return 'text';
      }
    }
    ref.render(createElement(App));
    expect(document.body.innerHTML).toEqual('text');
  });

  it('should render an array of elements to the dom', () => {
    ref.render([
      createElement('div', {}, ['text 1']),
      createElement('div', {}, ['text 2']),
    ]);
    expect(document.body.innerHTML).toEqual('<div>text 1</div><div>text 2</div>');
  });

  it('should render an array of function elements to the dom', () => {
    const Comp1 = () => createElement('div', {}, ['text 1']);
    const Comp2 = () => createElement('div', {}, ['text 2']);
    ref.render([
      createElement(Comp1),
      createElement(Comp2),
    ]);
    expect(document.body.innerHTML).toEqual('<div>text 1</div><div>text 2</div>');
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
    ref.render([
      createElement(Comp1),
      createElement(Comp2),
    ]);
    expect(document.body.innerHTML).toEqual('<div>text 1</div><div>text 2</div>');
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
    ref.render(createElement(Comp));
    expect(document.body.innerHTML).toEqual('<div>text 1</div><div>text 2</div>');
  });

  it('should render a component that returns a null render', () => {
    const Comp = () => null;
    ref.render(createElement(Comp));
    expect(document.body.innerHTML).toEqual('');
  });

  it('should change a class component\'s render', () => {
    class Comp extends Component {
      click() {
        this.setState('text');
      }

      render() {
        return createElement('button', { onclick: this.click.bind(this) }, [this.state || 'default']);
      }
    }
    ref.render(createElement(Comp));
    expect(document.body.innerHTML).toEqual('<button>default</button>');
    document.body.firstChild.click();
    timeouts.runAll();
    expect(document.body.innerHTML).toEqual('<button>text</button>');
  });

  it('should change a class component\'s render while referencing previous state', () => {
    class Comp extends Component {
      click() {
        this.setState(previousState => (previousState ? previousState + 'text' : 'text'));
      }

      render() {
        return createElement('button', { onclick: this.click.bind(this) }, [this.state || 'default']);
      }
    }
    ref.render(createElement(Comp));
    expect(document.body.innerHTML).toEqual('<button>default</button>');
    document.body.firstChild.click();
    timeouts.runAll();
    expect(document.body.innerHTML).toEqual('<button>text</button>');
    document.body.firstChild.click();
    timeouts.runAll();
    expect(document.body.innerHTML).toEqual('<button>texttext</button>');
  });

  it('should add items to a list and rerender the list', () => {
    class Comp extends Component {
      constructor(props) {
        super(props);

        this.state = [];
      }

      renderItems() {
        return createElement('ul', {}, [this.state.map(item => ({ signature: 'li', children: [item] }))]);
      }

      click() {
        this.setState([...this.state, 'item ' + (this.state.length + 1)]);
      }

      render() {
        return [
          this.state.length ? this.renderItems() : null,
          createElement('button', { onclick: this.click.bind(this) }, ['Add Item']),
        ];
      }
    }
    ref.render(createElement(Comp));
    expect(document.body.innerHTML).toEqual('<button>Add Item</button>');
    document.body.firstChild.click();
    timeouts.runAll();
    expect(document.body.innerHTML).toEqual('<ul><li>item 1</li></ul><button>Add Item</button>');
    document.body.firstChild.nextSibling.click();
    timeouts.runAll();
    expect(document.body.innerHTML).toEqual('<ul><li>item 1</li><li>item 2</li></ul><button>Add Item</button>');
  });

  it('should render a component with lifecycle hooks', () => {
    class App extends Component {
      state = 0;

      componentDidMount() {
        document.title = 'load';
      }

      componentDidUpdate() {
        document.title = `state ${this.state}`;
      }

      increment() {
        this.setState(this.state + 1);
      }

      render() {
        return createElement('button', { onclick: this.increment.bind(this) }, ['Click']);
      }
    }
    ref.render(createElement(App));
    expect(document.body.innerHTML).toEqual('<button>Click</button>');
    expect(document.title).toEqual('load');
    document.body.firstChild.click();
    timeouts.runAll();
    expect(document.title).toEqual('state 1');
  });

  it('should render a componentWillUnmount lifecycle hook', () => {
    const Page1 = () => 'Page 1';

    class Page2 extends Component {
      componentDidMount() {
        this.originalTitle = document.title;
        document.title = 'set title';
      }

      componentWillUnmount() {
        document.title = this.originalTitle;
      }

      render() {
        return 'Page 2';
      }
    }

    const App = () => {
      const [pageTwoOpen, setPageTwoOpen] = useState(false);
      const togglePageTwoOpen = () => {
        setPageTwoOpen(!pageTwoOpen);
      };

      useEffect(() => {
        window.document.title = 'default title';
      });

      return [
        createElement('button', {
          type: 'button',
          onclick: togglePageTwoOpen,
        }, ['Click Me']),
        pageTwoOpen
          ? createElement(Page2) : createElement(Page1),
      ];
    };

    ref.render(createElement(App));
    expect(window.document.title).toEqual('default title');
    document.body.firstChild.click();
    timeouts.runAll();
    expect(window.document.title).toEqual('set title');
    document.body.firstChild.click();
    timeouts.runAll();
    expect(window.document.title).toEqual('default title');
  });
});

describe('e2e.hooks', () => {
  let ref;
  let timeouts;
  beforeEach(() => {
    ref = createRef(document.body);
    timeouts = useMyTimers();
  });

  afterEach(() => {
    resetMyTimers();
    while(document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    window.document.title = '';
    infra.effectService.indexes.forEach(idx => {
      infra.services.destroyInstance(idx);
    });
  });

  it('should render an app with useMemo', () => {
    const memoMock = jest.fn();
    const HookedApp = () => {
      const [state, setState] = useState(0);
      const text = useMemo(() => {
        memoMock();
        return 'Click ';
      });
      const incrementState = () => {
        setState(state + 1);
      };

      return createElement('button', {
        onclick: incrementState,
      }, [text + state]);
    };
    ref.render(createElement(HookedApp));
    expect(memoMock).toHaveBeenCalledTimes(1);
    expect(document.body.innerHTML).toEqual('<button>Click 0</button>');
    document.body.firstChild.click();
    timeouts.runAll();
    expect(document.body.innerHTML).toEqual('<button>Click 1</button>');
    expect(memoMock).toHaveBeenCalledTimes(1);
  });

  it('should update a memo when dependencies change', () => {
    const memoMock = jest.fn();
    const HookedApp = () => {
      const [state, setState] = useState(0);
      const text = useMemo(() => {
        memoMock();
        return 'Click ';
      }, [state]);
      const incrementState = () => {
        setState(state + 1);
      };

      return createElement('button', {
        onclick: incrementState,
      }, [text + state]);
    };
    ref.render(createElement(HookedApp));
    expect(memoMock).toHaveBeenCalledTimes(1);
    expect(document.body.innerHTML).toEqual('<button>Click 0</button>');
    document.body.firstChild.click();
    timeouts.runAll();
    expect(document.body.innerHTML).toEqual('<button>Click 1</button>');
    expect(memoMock).toHaveBeenCalledTimes(2);
  });

  it('should render an app with useState', () => {
    const HookedApp = () => {
      const [state, setState] = useState(0);
      const incrementState = () => {
        setState(state + 1);
      };

      return createElement('button', {
        onclick: incrementState,
      }, ['Click ' + state]);
    };
    ref.render(createElement(HookedApp));
    expect(document.body.innerHTML).toEqual('<button>Click 0</button>');
    document.body.firstChild.click();
    timeouts.runAll();
    expect(document.body.innerHTML).toEqual('<button>Click 1</button>');
    document.body.firstChild.click();
    timeouts.runAll();
    expect(document.body.innerHTML).toEqual('<button>Click 2</button>');
  });

  it('should render an app with useEffect', () => {
    const Page1 = () => 'Page 1';

    const Page2 = () => {
      useEffect(() => {
        const originalTitle = window.document.title;
        window.document.title = 'set title';
        return () => {
          window.document.title = originalTitle;
        };
      });
      return 'Page 2';
    }

    const App = () => {
      const [pageTwoOpen, setPageTwoOpen] = useState(false);
      const togglePageTwoOpen = () => {
        setPageTwoOpen(!pageTwoOpen);
      };

      useEffect(() => {
        window.document.title = 'default title';
      });

      return [
        createElement('button', {
          type: 'button',
          onclick: togglePageTwoOpen,
        }, ['Click Me']),
        pageTwoOpen
          ? createElement(Page2) : createElement(Page1),
      ];
    };

    ref.render(createElement(App));
    expect(window.document.title).toEqual('default title');
    document.body.firstChild.click();
    timeouts.runAll();
    expect(window.document.title).toEqual('set title');
    document.body.firstChild.click();
    timeouts.runAll();
    expect(window.document.title).toEqual('default title');
  });

  it('should not run domEffects on class components if effectConditions is an empty array', () => {
    const DomEffectOnce = () => {
      let [state, setState] = useState(0);
      const incrementState = () => {
        setState(++state);
      };

      useEffect(() => {
        window.document.title = 'set title - ' + state;
      }, []);

      return createElement('button', {
        onclick: incrementState,
      }, ['button text - ' + state]);
    };
    ref.render(createElement(DomEffectOnce));
    expect(window.document.title).toEqual('set title - 0');
    expect(document.body.firstChild.innerHTML).toEqual('button text - 0');
    document.body.firstChild.click();
    timeouts.runAll();
    expect(window.document.title).toEqual('set title - 0');
    expect(document.body.firstChild.innerHTML).toEqual('button text - 1');
    document.body.firstChild.click();
    timeouts.runAll();
    expect(window.document.title).toEqual('set title - 0');
    expect(document.body.firstChild.innerHTML).toEqual('button text - 2');
  });

  it('should run domEffects if dependencies change', () => {
    const DomEffectWithClick = () => {
      let [state, setState] = useState(0);
      let [tick, updateTick] = useState(0);
      const incrementState = () => {
        setState(++state);
      };
      const updateHook = () => {
        updateTick(++tick);
      };

      useEffect(() => {
        window.document.title = 'set title - ' + state;
      }, [tick]);

      return [
        createElement('button', { onclick: incrementState }, ['button text - ' + state]),
        createElement('button', { onclick: updateTick }, ['Click']),
      ];
    };
    ref.render(createElement(DomEffectWithClick));
    expect(window.document.title).toEqual('set title - 0');
    expect(document.body.firstChild.innerHTML).toEqual('button text - 0');
    document.body.firstChild.click();
    timeouts.runAll();
    expect(window.document.title).toEqual('set title - 0');
    expect(document.body.firstChild.innerHTML).toEqual('button text - 1');
    document.body.firstChild.nextSibling.click();
    timeouts.runAll();
    expect(window.document.title).toEqual('set title - 1');
    expect(document.body.firstChild.innerHTML).toEqual('button text - 1');
  });

  it('should process an effect that updates state', () => {
    const DomEffectUpdatesState = () => {
      const [state, setState] = useState();
      useEffect(() => {
        if (!state) setState('text');
      });
      return state || 'default text';
    };
    ref.render(createElement(DomEffectUpdatesState));
    expect(document.body.innerHTML).toEqual('default text');
    timeouts.runAll();
    expect(document.body.innerHTML).toEqual('text');
  });

  it('should throw a error if a continuous loop is caused with useEffect and useState', () => {
    const DomEffectUpdatesState = () => {
      const [state, setState] = useState();
      useEffect(() => {
        setState('text');
      });
      return state || 'default text';
    };
    ref.render(createElement(DomEffectUpdatesState));
    expect(document.body.innerHTML).toEqual('default text');
    expect(() => timeouts.runAll()).toThrow('ImplementationError: Maximum call depth exceeded');
  });

  it('should render a component with useContext', () => {
    const ctx = createContext('context value');
    const ContextFunction = () => {
      const contextValue = useContext(ctx);
      return contextValue;
    };
    ref.render(createElement(ContextFunction));
    expect(document.body.innerHTML).toEqual('context value');
  });
});

describe('e2e.context', () => {
  let ref;
  beforeEach(() => {
    ref = createRef(document.body);
  });

  afterEach(() => {
    while(document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should render a class component with contextType', () => {
    const ctx = createContext('context value');
    class ContextComponent extends Component {
      static contextType = ctx;

      render() {
        return this.context;
      }
    }
    ref.render(createElement(ContextComponent));
    expect(document.body.innerHTML).toEqual('context value');
  });

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
    ref.render(render);
    expect(document.body.innerHTML).toEqual('<div><span>provided value</span><span>default value</span></div>');
  });
});
