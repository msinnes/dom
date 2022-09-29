/**
 * @jest-environment jsdom
 */
import { BaseDomRenderController } from '../BaseDomRenderController';

import { DomBootstrapController } from '../DomBootstrapController';

import createElement from '@internal/utils/createElement';
import { RenderableComponent } from '@internal/app/AppRenderer';

describe('DomBootstrapController', () => {
  it('should be a class', () => {
    expect(DomBootstrapController).toBeInstanceOf(Function);
  });

  describe('instance', () => {
    let instance;
    let rootRender;
    beforeEach(() => {
      rootRender = createElement('div');
      instance = new DomBootstrapController(rootRender, document.body);
    });

    it('should be an instance of BaseDomRenderController', () => {
      expect(instance).toBeInstanceOf(BaseDomRenderController);
    });

    describe('bootstrap', () => {
      it('should be a function', () => {
        expect(instance.bootstrap).toBeInstanceOf(Function);
      });

      it('should call renderApp and renderDom', done => {
        const renderAppMock = jest.fn();
        const renderDomMock = jest.fn();
        instance.renderApp = renderAppMock;
        instance.renderDom = renderDomMock;
        instance.bootstrap();
        setTimeout(() => {
          expect(renderAppMock).toHaveBeenCalledTimes(1);
          expect(renderDomMock).toHaveBeenCalledTimes(1);
          done();
        });
      });
    });
  });
});

afterEach(() => {
  document.getElementsByTagName('html')[0].innerHTML = '';
});

describe('e2e', () => {
  it('should render a basic application to the dom', done => {
    class App extends RenderableComponent {
      render() {
        return createElement('div', { innerText: this.props.text });
      }
    }

    const testInstance = new DomBootstrapController(createElement(App, { text: 'text 1' }), document.body);
    testInstance.bootstrap();
    setTimeout(() => {
      setTimeout(() => {
        expect(document.body.children.length).toEqual(1);
        expect(document.body.firstChild.tagName).toEqual('DIV');
        expect(document.body.firstChild.innerText).toEqual('text 1');
        done();
      });
    });
  });

  it('should render a more detailed application to the dom', done => {
    class P extends RenderableComponent {
      render () {
        return createElement('p', { innerText: this.props.text });
      }
    }

    class Div extends RenderableComponent {
      render() {
        return createElement('div', {}, [
          createElement(P, { text: 'text 1' }),
          createElement(P, { text: 'text 2' }),
          createElement(P, { text: 'text 3' }),
        ]);
      }
    }

    class App extends RenderableComponent {
      render() {
        return createElement(Div);
      }
    }

    const testInstance = new DomBootstrapController(createElement(App), document.body);
    testInstance.bootstrap();
    setTimeout(() => {
      setTimeout(() => {
        expect(document.body.children.length).toEqual(1);
        expect(document.body.firstChild.tagName).toEqual('DIV');
        expect(document.body.firstChild.children.length).toEqual(3);
        expect(document.body.firstChild.children[0].tagName).toEqual('P');
        expect(document.body.firstChild.children[0].innerText).toEqual('text 1');
        expect(document.body.firstChild.children[1].tagName).toEqual('P');
        expect(document.body.firstChild.children[1].innerText).toEqual('text 2');
        expect(document.body.firstChild.children[2].tagName).toEqual('P');
        expect(document.body.firstChild.children[2].innerText).toEqual('text 3');
        done();
      });
    });
  });

  it('should render a string to the dom', done => {
    const testInstance = new DomBootstrapController('text', document.body);
    testInstance.bootstrap();
    setTimeout(() => {
      setTimeout(() => {
        expect(document.body.firstChild.wholeText).toEqual('text');
        done();
      });
    });
  });

  it('should update the state of the component and render the app', done => {
    class App extends RenderableComponent {
      constructor() {
        super();
        this.state = {
          count: 0,
        };
      }

      render() {
        return createElement('div', {}, [
          createElement('p', { innerText: 'text ' + this.state.count }),
        ]);
      }
    }

    const testInstance = new DomBootstrapController(createElement(App), document.body);
    testInstance.bootstrap();
    setTimeout(() => {
      setTimeout(() => {
        const componentInstance = testInstance.appRenderer.root.firstChild;
        expect(document.body.firstChild.children[0].innerText).toEqual('text 0');
        testInstance.renderFrame(componentInstance, { count: 1 });
        setTimeout(() => {
          setTimeout(() => {
            setTimeout(() => {
              setTimeout(() => {
                expect(document.body.firstChild.children[0].innerText).toEqual('text 1');
                testInstance.renderFrame(componentInstance, { count: 2 });
                setTimeout(() => {
                  setTimeout(() => {
                    setTimeout(() => {
                      setTimeout(() => {
                        expect(document.body.firstChild.children[0].innerText).toEqual('text 2');
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