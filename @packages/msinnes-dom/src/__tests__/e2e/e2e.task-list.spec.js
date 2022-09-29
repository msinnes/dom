/**
 * @jest-environment jsdom
 */
import {
  Component,
  renderApp,
  createElement,
} from '../..';

describe('task list', () => {
  it('should render a basic task list', done => {
    const ItemList = ({ items }) => createElement('ul', {}, items.map(item => ({ signature: Item, props: { text: item } })));
    const Item = ({ text }) => createElement('li', {}, [text]);
    const AddButton = ({ onclick }) => createElement('button', { onclick, type: 'button' }, ['Add Item']);
    const didMountMock = jest.fn();
    const willUnmountMock = jest.fn();
    const someHandlerMock = jest.fn();
    class AddForm extends Component {
      constructor(props) {
        super(props);

        this.state = '';

        this.oninput = this.oninput.bind(this);
        this.onsubmit = this.onsubmit.bind(this);
      }

      componentDidMount() {
        didMountMock();
        this.someHandler();
      }

      componentWillUnmount() {
        willUnmountMock();
      }

      oninput(e) {
        this.setState(e.target.value);
      }

      onsubmit() {
        this.props.onsubmit(this.state);
        this.setState('');
      }

      someHandler() {
        someHandlerMock();
      }

      render() {
        return ([
          createElement('input', {
            oninput: this.oninput,
            value: this.state,
          }),
          createElement('button', {
            type: 'button',
            onclick: this.onsubmit,
          }, ['Add Item']),
        ]);
      }
    }

    const widgetWillUnmountMock = jest.fn();
    class AddWidget extends Component {
      constructor(props) {
        super(props);
        this.state = false;
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.onsubmit = this.onsubmit.bind(this);
      }

      componentWillUnmount() {
        widgetWillUnmountMock();
      }

      close() {
        this.setState(false);
      }

      open() {
        this.setState(true);
      }

      onsubmit(item) {
        this.props.addItem(item);
        this.close();
      }

      render() {
        return this.state ? createElement(AddForm, {
          onsubmit: this.onsubmit,
        }) : createElement(AddButton, {
          onclick: this.open,
        });
      }
    }

    class App extends Component {
      constructor(props) {
        super(props);

        this.state = [];

        this.addItem = this.addItem.bind(this);
      }

      addItem(item) {
        this.setState([...this.state, item]);
      }
      render() {
        return [
          createElement('div', {}, ['Item List']),
          this.state.length ? createElement(ItemList, { items: this.state }) : null,
          createElement(AddWidget, { addItem: this.addItem }),
        ];
      }
    }
    const render = createElement(App);
    renderApp(render, document.body);
    setTimeout(() => {
      setTimeout(() => {
        expect(document.body.innerHTML).toEqual('<div>Item List</div><button type="button">Add Item</button>');
        document.body.firstChild.nextSibling.click();
        setTimeout(() => {
          setTimeout(() => {
            setTimeout(() => {
              setTimeout(() => {
                expect(document.body.innerHTML).toEqual('<div>Item List</div><input><button type="button">Add Item</button>');
                expect(didMountMock).toHaveBeenCalledTimes(1);
                expect(willUnmountMock).toHaveBeenCalledTimes(0);
                expect(widgetWillUnmountMock).toHaveBeenCalledTimes(0);
                document.body.firstChild.nextSibling.value = 'm';
                const e = new InputEvent('input', { data: 'm' });
                document.body.firstChild.nextSibling.dispatchEvent(e);
                setTimeout(() => {
                  setTimeout(() => {
                    setTimeout(() => {
                      setTimeout(() => {
                        expect(document.body.innerHTML).toEqual('<div>Item List</div><input><button type="button">Add Item</button>');
                        expect(document.body.firstChild.nextSibling.value).toEqual('m');
                        document.body.firstChild.nextSibling.nextSibling.click();
                        setTimeout(() => {
                          setTimeout(() => {
                            setTimeout(() => {
                              setTimeout(() => {
                                setTimeout(() => {
                                  setTimeout(() => {
                                    expect(document.body.innerHTML).toEqual('<div>Item List</div><ul><li>m</li></ul><button type="button">Add Item</button>')
                                    expect(didMountMock).toHaveBeenCalledTimes(1);
                                    expect(someHandlerMock).toHaveBeenCalledTimes(1);
                                    expect(willUnmountMock).toHaveBeenCalledTimes(1);
                                    expect(widgetWillUnmountMock).toHaveBeenCalledTimes(0);
                                    done();
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});