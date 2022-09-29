/**
 * @jest-environment jsdom
 */
import {
  renderApp,
  useState,
  createElement,
} from '../../..';

describe('useState', () => {
  it('should render a basic app with hooks', done => {
    const HookedApp = () => {
      const [state, setState] = useState(0);
      const incrementState = () => {
        setState(state + 1);
      };

      return createElement('button', {
        onclick: incrementState,
      }, ['Click ' + state]);
    };
    const render = createElement(HookedApp);
    renderApp(render, document.body);
    setTimeout(() => {
      setTimeout(() => {
        expect(document.body.innerHTML).toEqual('<button>Click 0</button>');
        document.body.firstChild.click();
        setTimeout(() => {
          setTimeout(() => {
            setTimeout(() => {
              setTimeout(() => {
                setTimeout(() => {
                  expect(document.body.innerHTML).toEqual('<button>Click 1</button>');
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