/**
 * @jest-environment jsdom
 */
import {
  renderApp,
  useMemo,
  useState,
  createElement,
} from '../../..';

describe('useMemo', () => {
  it('should render an app with useMemo', done => {
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
    const render = createElement(HookedApp);
    renderApp(render, document.body);
    setTimeout(() => {
      setTimeout(() => {
        expect(memoMock).toHaveBeenCalledTimes(1);
        expect(document.body.innerHTML).toEqual('<button>Click 0</button>');
        document.body.firstChild.click();
        setTimeout(() => {
          setTimeout(() => {
            setTimeout(() => {
              setTimeout(() => {
                setTimeout(() => {
                  expect(document.body.innerHTML).toEqual('<button>Click 1</button>');
                  expect(memoMock).toHaveBeenCalledTimes(1);
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