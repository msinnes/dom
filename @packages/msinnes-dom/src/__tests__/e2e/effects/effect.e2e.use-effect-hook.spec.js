/**
 * @jest-environment jsdom
 */
 import { Component, renderApp, useEffect, useState, createElement } from '../../..';

 afterEach(() => {
   while(document.body.firstChild) {
     document.body.removeChild(document.body.firstChild);
   }
 });

 describe('class effect', () => {
  it('should render class components with dom effects', done => {
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

    const render = { signature: App, props: {} };
    renderApp(render, document.body);
    setTimeout(() => {
      setTimeout(() => {
        expect(window.document.title).toEqual('default title');
        document.body.firstChild.click();
        setTimeout(() => {
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
  });
 });