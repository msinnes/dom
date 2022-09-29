/**
 * @jest-environment jsdom
 */
import {
  Component,
  renderApp,
  createElement,
} from '../..';

afterEach(() => {
  while(document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
});

describe('index.e2e', () => {
  describe('renderApp', () => {
    it('should not render undefined to the dom', () => {
      renderApp(undefined, document.body);
      expect(document.body.innerHTML).toEqual('');
    });

    it('should not render null to the dom', () => {
      renderApp(null, document.body);
      expect(document.body.innerHTML).toEqual('');
    });

    it('should not render an empty string to the dom', () => {
      renderApp('', document.body);
      expect(document.body.innerHTML).toEqual('');
    });

    it('should not render a white space string to the dom', () => {
      renderApp('   \n', document.body);
      expect(document.body.innerHTML).toEqual('');
    });

    it('should not render an empty array to the dom', () => {
      renderApp([], document.body);
      expect(document.body.innerHTML).toEqual('');
    });

    it('should render a string to the dom', done => {
      renderApp('text', document.body);
      setTimeout(() => {
        setTimeout(() => {
          expect(document.body.innerHTML).toEqual('text');
          done();
        });
      });
    });

    it('should render an element to the dom', done => {
      renderApp({ signature: 'div' }, document.body);
      setTimeout(() => {
        setTimeout(() => {
          expect(document.body.innerHTML).toEqual('<div></div>');
          done();
        });
      });
    });

    it('should render a function to the dom', done => {
      const App = () => 'text';
      renderApp({ signature: App }, document.body);
      setTimeout(() => {
        setTimeout(() => {
          expect(document.body.innerHTML).toEqual('text');
          done();
        });
      });
    });

    it('should render a class component to the dom', done => {
      class App extends Component {
        render() {
          return 'text';
        }
      }
      renderApp({ signature: App }, document.body);
      setTimeout(() => {
        setTimeout(() => {
          expect(document.body.innerHTML).toEqual('text');
          done();
        });
      });
    });

    it('should render an array of elements to the dom', done => {
      const render = [
        createElement('div', {}, ['text 1']),
        createElement('div', {}, ['text 2']),
      ];
      renderApp(render, document.body);
      setTimeout(() => {
        setTimeout(() => {
          expect(document.body.innerHTML).toEqual('<div>text 1</div><div>text 2</div>');
          done();
        });
      });
    });

    it('should render an array of function elements to the dom', done => {
      const Comp1 = () => createElement('div', {}, ['text 1']);
      const Comp2 = () => createElement('div', {}, ['text 2']);
      const render = [
        createElement(Comp1),
        createElement(Comp2),
      ];
      renderApp(render, document.body);
      setTimeout(() => {
        setTimeout(() => {
          expect(document.body.innerHTML).toEqual('<div>text 1</div><div>text 2</div>');
          done();
        });
      });
    });

    it('should render an array of class elements to the dom', done => {
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
      const render = [
        createElement(Comp1),
        createElement(Comp2),
      ];
      renderApp(render, document.body);
      setTimeout(() => {
        setTimeout(() => {
          expect(document.body.innerHTML).toEqual('<div>text 1</div><div>text 2</div>');
          done();
        });
      });
    });

    it('should change a class component\'s render', done => {
      class Comp extends Component {
        click() {
          this.setState('text');
        }

        render() {
          return createElement('button', { onclick: this.click.bind(this) }, [this.state || 'default']);
        }
      }
      const render = createElement(Comp);
      renderApp(render, document.body);
      setTimeout(() => {
        setTimeout(() => {
          expect(document.body.innerHTML).toEqual('<button>default</button>');
          document.body.firstChild.click();
          setTimeout(() => {
            setTimeout(() => {
              setTimeout(() => {
                setTimeout(() => {
                  expect(document.body.innerHTML).toEqual('<button>text</button>');
                  done();
                });
              });
            });
          });
        });
      });
    });

    it('should change a class component\'s render while referencing previous state', (done) => {
      class Comp extends Component {
        click() {
          this.setState(previousState => (previousState ? previousState + 'text' : 'text'));
        }

        render() {
          return createElement('button', { onclick: this.click.bind(this) }, [this.state || 'default']);
        }
      }
      const render = createElement(Comp);
      renderApp(render, document.body);
      setTimeout(() => {
        setTimeout(() => {
          expect(document.body.innerHTML).toEqual('<button>default</button>');
          document.body.firstChild.click();
          setTimeout(() => {
            setTimeout(() => {
              setTimeout(() => {
                setTimeout(() => {
                  expect(document.body.innerHTML).toEqual('<button>text</button>');
                  document.body.firstChild.click();
                  setTimeout(() => {
                    setTimeout(() => {
                      setTimeout(() => {
                        setTimeout(() => {
                          expect(document.body.innerHTML).toEqual('<button>texttext</button>');
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

    it('should add items to a list and rerender the list', (done) => {
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

      const render = createElement(Comp);
      renderApp(render, document.body);
      setTimeout(() => {
        setTimeout(() => {
          expect(document.body.innerHTML).toEqual('<button>Add Item</button>');
          document.body.firstChild.click();
          setTimeout(() => {
            setTimeout(() => {
              setTimeout(() => {
                setTimeout(() => {
                  expect(document.body.innerHTML).toEqual('<ul><li>item 1</li></ul><button>Add Item</button>');
                  document.body.firstChild.nextSibling.click();
                  setTimeout(() => {
                    setTimeout(() => {
                      setTimeout(() => {
                        setTimeout(() => {
                          expect(document.body.innerHTML).toEqual('<ul><li>item 1</li><li>item 2</li></ul><button>Add Item</button>');
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

    it('should render a class component that returns a fragment', () => {
      class Comp extends Component {
        render() {
          return [
            createElement('div', {}, ['text 1']),
            createElement('div', {}, ['text 2']),
          ];
        }
      }
      const render = createElement(Comp);
      renderApp(render, document.body);
      setTimeout(() => {
        setTimeout(() => {
          expect(document.body.innerHTML).toEqual('<div>text 1</div><div>text 2</div>');
        });
      });
    });
  });
});