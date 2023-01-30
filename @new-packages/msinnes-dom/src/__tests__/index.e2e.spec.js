/**
 * @jest-environment jsdom
 */
import { Component, createRef, createElement, useMemo, useState } from '..';

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
});
