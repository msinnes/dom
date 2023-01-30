import { createElement, Component, useState } from '@new-msinnes/dom';

import { render } from '..';

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
    const screen = render(createElement('div'));
    expect(screen.container.innerHTML).toEqual('<div></div>');
  });

  it('should render a function component to the dom', () => {
    const App = () => 'text';
    const screen = render(createElement(App));
    expect(screen.container.innerHTML).toEqual('text');
  });

  it('should render a class component to the dom', () => {
    class App extends Component {
      render() {
        return 'text';
      }
    }
    const screen = render(createElement(App));
    expect(screen.container.innerHTML).toEqual('text');
  });

  it('should render an array of elements to the dom', () => {
    const screen = render([
      createElement('div', {}, ['text 1']),
      createElement('div', {}, ['text 2']),
    ]);
    expect(screen.container.innerHTML).toEqual('<div>text 1</div><div>text 2</div>');
  });

  it('should render an array of function elements to the dom', () => {
    const Comp1 = () => createElement('div', {}, ['text 1']);
    const Comp2 = () => createElement('div', {}, ['text 2']);
    const screen = render([
      createElement(Comp1),
      createElement(Comp2),
    ]);
    expect(screen.container.innerHTML).toEqual('<div>text 1</div><div>text 2</div>');
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
    const screen = render([
      createElement(Comp1),
      createElement(Comp2),
    ]);
    expect(screen.container.innerHTML).toEqual('<div>text 1</div><div>text 2</div>');
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
    const screen = render(createElement(Comp));
    expect(screen.container.innerHTML).toEqual('<div>text 1</div><div>text 2</div>');
  });

  it('should render a component that returns a null render', () => {
    const Comp = () => null;
    const screen = render(createElement(Comp));
    expect(screen.container.innerHTML).toEqual('');
  });

  it('should render a component with setState', () => {
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
    const screen = render(createElement(Comp));
    expect(screen.container.innerHTML).toEqual('<button>Add Item</button>');
    screen.container.firstChild.click();
    expect(screen.container.innerHTML).toEqual('<ul><li>item 1</li></ul><button>Add Item</button>');
    screen.container.firstChild.nextSibling.click();
    expect(screen.container.innerHTML).toEqual('<ul><li>item 1</li><li>item 2</li></ul><button>Add Item</button>');
  });

  it('should render a component with a useState hook', () => {
    const HookedApp = () => {
      const [state, setState] = useState(0);
      const incrementState = () => {
        setState(state + 1);
      };
      return createElement('button', {
        onclick: incrementState,
      }, ['Click ' + state]);
    };
    const screen = render(createElement(HookedApp));
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
    screen = render(createElement('div', {}, [
      createElement('span', {}, ['duplicate']),
      createElement('span', {}, ['query']),
      createElement('span', {}, ['duplicate']),
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