import { Component, useState } from '@msinnes/dom';

import * as api from '..';

describe('index', () => {
  it('should expose a render function', () => {
    expect(api.render).toBeInstanceOf(Function);
  });

  describe('render e2e.basic', () => {
    let screen;

    beforeEach(() => {
      screen = api.render(
        <div>
          <span>duplicate</span>
          <span>queryable</span>
          <span>duplicate</span>
        </div>
      );
    });

    describe('getByText', () => {
      it('should return a single element if found', () => {
        const elem = screen.getByText('queryable');
        expect(elem).toBeDefined();
        expect(elem).toBe(screen.container.firstChild.firstChild.nextSibling);
      });

      it('should throw an error if no element is found', () => {
        expect(() => {
          screen.getByText('not found text');
        }).toThrow('getByText did not find any results');
      });

      it('should throw an error in too many elements are found', () => {
        expect(() => {
          screen.getByText('duplicate');
        }).toThrow('getByText found too many results');
      });
    });

    describe('getAllByText', () => {
      it('should return an array of all elements found by the query', () => {
        const elems = screen.getAllByText('duplicate');
        expect(elems).toBeInstanceOf(Array);
        expect(elems.length).toBe(2);
        expect(elems[0]).toBe(screen.container.firstChild.firstChild);
        expect(elems[1]).toBe(screen.container.firstChild.firstChild.nextSibling.nextSibling);
      });
    });
  });

  describe('render e2e.click', () => {
    let screen;
    let clickMock;
    beforeEach(() => {
      clickMock = jest.fn();
      screen = api.render(
        <div>
          <button onclick={clickMock}>Click Me</button>
        </div>
      );
    });

    it('should click the element', () => {
      const button = screen.getByText('Click Me');
      button.click();
      expect(clickMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('render e2e.labelQuery', () => {
    describe('basic setup', () => {
      let screen;
      beforeEach(() => {
        const Form = () => (
          <form>
            <label for="input">Query</label>
            <input name="input"/>
          </form>
        );
        screen = api.render(<Form />);
      });

      it('should select an input by its label', () => {
        const input = screen.getByLabelText('Query');
        expect(input).toBe(screen.container.firstChild.firstChild.nextSibling);
      });
    });

    describe('multiple labels', () => {
      let screen;
      beforeEach(() => {
        const Form = () => (
          <form>
            <div>
              <label for="one">Query</label>
              <div>
                <input name="one"/>
              </div>
            </div>
            <div>
              <label for="two">Query</label>
              <input name="two"/>
            </div>
          </form>
        );
        screen = api.render(<Form />)
      });

      it('should return both input fields', () => {
        const inputs = screen.getAllByLabelText('Query');
        expect(screen.container.firstChild.firstChild.firstChild.nextSibling.firstChild).toBe(inputs[0]);
        expect(screen.container.firstChild.firstChild.nextSibling.firstChild.nextSibling).toBe(inputs[1]);
      });
    });
  });

  describe('render e2e.setState', () => {
    describe('class component', () => {
      let screen;
      beforeEach(() => {
        class Counter extends Component {
          state = 0;

          constructor(props) {
            super(props);

            this.onclick = this.onclick.bind(this);
          }

          onclick() {
            this.setState(this.state + 1);
          };

          render() {
            return (
              <div>
                <div>Count: {this.state}</div>
                <button onclick={this.onclick}>Click Me</button>
              </div>
            );
          }
        }
        screen = api.render(<Counter />);
      });

      it('should render', () => {
        expect(screen.container.firstChild.firstChild.textContent).toEqual('Count: 0');
        expect(screen.container.firstChild.firstChild.nextSibling.textContent).toEqual('Click Me');
      });

      it('should rerender when the button is clicked', () => {
        screen.getByText('Click Me').click();
        expect(screen.container.firstChild.firstChild.textContent).toEqual('Count: 1');
        expect(screen.container.firstChild.firstChild.nextSibling.textContent).toEqual('Click Me');
      });
    });

    describe('function component with hooks', () => {
      let screen;
      beforeEach(() => {
        const Counter = () => {
          const [state, setState] = useState(0);

          return (
            <div>
              <div>Count: {state}</div>
              <button onclick={() => setState(state + 1)}>Click Me</button>
            </div>
          );
        };
        screen = api.render(<Counter />);
      });

      it('should render', () => {
        expect(screen.container.firstChild.firstChild.textContent).toEqual('Count: 0');
        expect(screen.container.firstChild.firstChild.nextSibling.textContent).toEqual('Click Me');
      });

      it('should rerender when the button is clicked', () => {
        screen.getByText('Click Me').click();
        expect(screen.container.firstChild.firstChild.textContent).toEqual('Count: 1');
        expect(screen.container.firstChild.firstChild.nextSibling.textContent).toEqual('Click Me');
      });
    });
  });

  describe('render e2e.url', () => {
    let screen;
    beforeEach(() => {
      const Location = () => window.location.href;
      screen = api.render(<Location />, { url: 'http://url.com'});
    });

    it('should set location on dom if url is passed to config', () => {
      expect(screen.container.textContent).toEqual('http://url.com/');
    });
  });

  describe('matcher e2e.toBeOnScreen', () => {
    it('should pass expectations if element is on screen', () => {
      const screen = api.render(
        <div>
          <button>Click Me</button>
        </div>
      );
      expect(screen.getByText('Click Me')).toBeOnScreen(screen);
    });

    it('should pass expectatins if multiple elements are on screen', () => {
      const screen = api.render(
        <div>
          <button>1</button>
          <button>2</button>
          <button>3</button>
        </div>
      );
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toEqual(3);
      expect(buttons).toBeOnScreen(screen);
    });

    it('should render 2 screens at once and only return true if element is checked against the correct screen', () => {
      const screen1 = api.render(
        <div><button>Click Me</button></div>
      );
      const screen2 = api.render(
        <div><table></table></div>
      );
      const button = screen1.getByRole('button');
      const table = screen2.getByRole('table');
      expect(button).toBeOnScreen(screen1);
      expect(button).not.toBeOnScreen(screen2);
      expect(table).not.toBeOnScreen(screen1);
      expect(table).toBeOnScreen(screen2);
    });
  });
});
