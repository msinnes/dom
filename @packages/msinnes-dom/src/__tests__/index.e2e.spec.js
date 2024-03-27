/**
 * @jest-environment jsdom
 */
import { Component, createRef, createElement, useContext, useEffect, useMemo, useState, createContext, useRef } from '..';

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

  it('should render a ref to the dom', () => {
    const divRef = createRef('div');
    ref.render(createElement(divRef));
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
    };

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

  it('should render a component with useRef', () => {
    const App = () => {
      const Div = useRef('div');
      return createElement(Div, {}, ['text']);
    };
    ref.render(createElement(App));
    expect(document.body.innerHTML).toEqual('<div>text</div>');
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

// TODO: (svg-update) add svg e2e tests for all svg elements
// This needs to run the gambit to make sure that the jsx transpiler is configured to work with svg components
describe('e2e.svg', () => {
  let ref;
  beforeEach(() => {
    ref = createRef(document.body);
  });

  afterEach(() => {
    while(document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should render <a>', () => {
    ref.render(createElement('svg', { viewBox: '0 0 100 100' }, [
      createElement('a', { href: 'https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle' }, [
        createElement('circle', { cx: 50, cy: 40, r: 35 }),
      ]),
    ]));
    expect(document.body.firstChild).toBeInstanceOf(SVGElement);
    expect(document.body.firstChild.firstChild).toBeInstanceOf(SVGElement);
    expect(document.body.firstChild.firstChild.firstChild).toBeInstanceOf(SVGElement);
    expect(document.body.innerHTML).toEqual('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle"><circle cx="50" cy="40" r="35"></circle></a></svg>');
  });

  it('should render <animate>', () => {
    ref.render(createElement('svg', { viewBox: '0 0 100 100' }, [
      createElement('rect', { width: 10, height: 10 }, [
        createElement('animate', { attributeName: 'rx', values: '0;5;0', dur: '10s', repeatCount: 'indefinite' }),
      ]),
    ]));
    expect(document.body.firstChild).toBeInstanceOf(SVGElement);
    expect(document.body.firstChild.firstChild).toBeInstanceOf(SVGElement);
    expect(document.body.firstChild.firstChild.firstChild).toBeInstanceOf(SVGElement);
    expect(document.body.innerHTML).toEqual('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10"><animate attributeName="rx" values="0;5;0" dur="10s" repeatCount="indefinite"></animate></rect></svg>');
  });

  it('should render <animateMotion>', () => {
    ref.render(createElement('svg', { viewBox: '0 0 200 200' }, [
      createElement('path', { fill: 'none', stroke: 'lightgrey', d:'M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z' }),
      createElement('circle', { r: 5, fill: 'red' }, [
        createElement('animateMotion', { dur: '10s', repeatCount: 'indefinite', path:'M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z' }),
      ]),
    ]));
    expect(document.body.firstChild).toBeInstanceOf(SVGElement);
    expect(document.body.firstChild.firstChild).toBeInstanceOf(SVGElement);
    expect(document.body.firstChild.firstChild.nextSibling).toBeInstanceOf(SVGElement);
    expect(document.body.firstChild.firstChild.nextSibling.firstChild).toBeInstanceOf(SVGElement);
    expect(document.body.innerHTML).toEqual('<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="lightgrey" d="M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z"></path><circle r="5" fill="red"><animateMotion dur="10s" repeatCount="indefinite" path="M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z"></animateMotion></circle></svg>');
  });

  it('should render <animateTransform>', () => {
    ref.render(createElement('svg', { height: '120', width: '120', viewBox: '0 0 120 120' }, [
      createElement('polygon', { points: '60,30 90,90 30,90' }, [
        createElement('animateTransform', { attributeName: 'transform', attributeType: 'XML', type: 'rotate', from: '0 60 70', to: '360 60 70', dur: '10s', repeatCount: 'indefinite' }),
      ]),
    ]));
    expect(document.body.firstChild).toBeInstanceOf(SVGElement);
    expect(document.body.firstChild.firstChild).toBeInstanceOf(SVGElement);
    expect(document.body.firstChild.firstChild.firstChild).toBeInstanceOf(SVGElement);
    expect(document.body.innerHTML).toEqual('<svg height="120" width="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><polygon points="60,30 90,90 30,90"><animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 60 70" to="360 60 70" dur="10s" repeatCount="indefinite"></animateTransform></polygon></svg>');
  });

  it('should render <circle>', () => {
    ref.render(createElement('svg', { viewBox: '0 0 100 100' }, [
      createElement('circle', { cx: 50, cy: 50, r: 50 }),
    ]));
    expect(document.body.firstChild).toBeInstanceOf(SVGElement);
    expect(document.body.firstChild.firstChild).toBeInstanceOf(SVGElement);
    expect(document.body.innerHTML).toEqual('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50"></circle></svg>');
  });

  it('should render <clipPath>', () => {
    ref.render(createElement('svg', { viewBox: '0 0 100 100' }, [
      createElement('clipPath', { id: 'myClip' }, [
        createElement('circle', { cx: 40, cy: 35, r: 35 }),
      ]),
      createElement('path', { id: 'heart', d: 'M10,30 A20,20,0,0,1,50,30 A20,20,0,0,1,90,30 Q90,60,50,90 Q10,60,10,30 Z' }),
      createElement('use', { 'clip-path': 'url(#myClip)', href: '#heart', fill: 'red' }),
    ]));
    expect(document.body.firstChild).toBeInstanceOf(SVGElement);
    expect(document.body.firstChild.firstChild).toBeInstanceOf(SVGElement);
    expect(document.body.firstChild.firstChild.firstChild).toBeInstanceOf(SVGElement);
    expect(document.body.firstChild.firstChild.nextSibling).toBeInstanceOf(SVGElement);
    expect(document.body.firstChild.firstChild.nextSibling.nextSibling).toBeInstanceOf(SVGElement);
    expect(document.body.innerHTML).toEqual('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><clipPath id="myClip"><circle cx="40" cy="35" r="35"></circle></clipPath><path id="heart" d="M10,30 A20,20,0,0,1,50,30 A20,20,0,0,1,90,30 Q90,60,50,90 Q10,60,10,30 Z"></path><use clip-path="url(#myClip)" href="#heart" fill="red"></use></svg>');
  });

  it('should render <defs>', () => {
    ref.render(createElement('svg', { viewBox: '0 0 10 10' }, [
      createElement('defs', {}, [
        createElement('circle', { id:'myCircle', cx: 0, cy: 0, r: 5 }),
        createElement('linearGradient', { id: 'myGradient', gradientTransform: 'rotate(90)' }, [
          createElement('stop', { offset: '20%', 'stop-color': 'gold' }),
          createElement('stop', { offset: '90%', 'stop-color': 'red' }),
        ]),
      ]),
      createElement('use', { x: 5, y: 5, href: '#myCircle', fill: 'url(\'#myGradient\')' }),
    ]));
    expect(document.body.innerHTML).toEqual('<svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><defs><circle id="myCircle" cx="0" cy="0" r="5"></circle><linearGradient id="myGradient" gradientTransform="rotate(90)"><stop offset="20%" stop-color="gold"></stop><stop offset="90%" stop-color="red"></stop></linearGradient></defs><use x="5" y="5" href="#myCircle" fill="url(\'#myGradient\')"></use></svg>');
  });

  it('should render <desc>', () => {
    ref.render(createElement('svg', { viewBox: '0 0 10 10' }, [
      createElement('circle', { cx: 5, cy: 5, r: 4 }, [
        createElement('desc', {}, [
          'I\'m a circle and that description is here to demonstrate how I can be described, but is it really necessary to describe a simple circle like me?'
        ]),
      ]),
    ]));
    expect(document.body.innerHTML).toEqual('<svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="5" r="4"><desc>I\'m a circle and that description is here to demonstrate how I can be described, but is it really necessary to describe a simple circle like me?</desc></circle></svg>');
  });

  it('should render <ellipse>', () => {
    ref.render(createElement('svg', { viewBox: '0 0 200 100' }, [
      createElement('ellipse', { cx: 100, cy: 50, rx: 100, ry: 50 }),
    ]));
    expect(document.body.innerHTML).toEqual('<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="50" rx="100" ry="50"></ellipse></svg>');
  });

  // TODO: (svg-foreign-object-support): foriegn object support will require some work on @internal, similar to svg implementation
});
