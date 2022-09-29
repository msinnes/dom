/**
 * @jest-environment jsdom
 */
import { Component, renderApp, createElement } from '../../..';

afterEach(() => {
  while(document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
});

describe('class effect', () => {
  it('should render class components with dom effects', done => {
    class Page1 extends Component {
      render() {
        return 'Page 1';
      }
    }

    class Page2 extends Component {
      effect() {
        const originalTitle = window.document.title;
        window.document.title = 'set title';
        return () => {
          window.document.title = originalTitle;
        };
      }

      render() {
        return 'Page 2';
      }
    }

    class App extends Component {
      constructor(props) {
        super(props);

        this.state = {
          pageTwoOpen: false,
        };

        this.togglePageTwoOpen = this.togglePageTwoOpen.bind(this);
      }

      effect() {
        window.document.title = 'default title';
      }

      togglePageTwoOpen() {
        this.setState({ pageTwoOpen: !this.state.pageTwoOpen });
      }

      render() {
        return [
          createElement('button', {
            type: 'button',
            onclick: this.togglePageTwoOpen,
          }, ['Click Me']),
          this.state.pageTwoOpen
            ? createElement(Page2) : createElement(Page1),
        ];
      }
    }

    const render = createElement(App);
    renderApp(render, document.body);
    setTimeout(() => {
      setTimeout(() => {
        expect(window.document.title).toEqual('default title');
        document.body.firstChild.click();
        setTimeout(() => {
          setTimeout(() => {
            setTimeout(() => {
              setTimeout(() => {
                expect(window.document.title).toEqual('set title');
                document.body.firstChild.click();
                setTimeout(() => {
                  setTimeout(() => {
                    setTimeout(() => {
                      setTimeout(() => {
                        expect(window.document.title).toEqual('default title');
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