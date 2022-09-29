/**
 * @jest-environment jsdom
 */
import {
  renderApp,
  createElement,
} from '../..';

describe('function children', () => {
  it('should warn if function children are not executed', done => {
    const consoleWarnMock = jest.fn();
    const consoleWarnOriginal = jest.fn();
    console.warn = consoleWarnMock;

    const WithFunctionChildCall = props => props.children[0]();
    const WithoutFunctionChildCall = props => props.children;

    const render1 = createElement(WithFunctionChildCall, {}, [
      () => ({ signature: 'div', props: {}, children: ['Some Text']}),
    ]);
    renderApp(render1, document.body);
    setTimeout(() => {
      setTimeout(() => {
        expect(consoleWarnMock).not.toHaveBeenCalled();
        expect(document.body.firstChild.innerHTML).toEqual('Some Text');

        while(document.body.firstChild) {
          document.body.removeChild(document.body.firstChild);
        }

        const render2 = createElement(WithoutFunctionChildCall, {}, [
          () => ({ signature: 'div', props: {}, children: ['Some Text']}),
        ]);

        renderApp(render2, document.body);
        setTimeout(() => {
          setTimeout(() => {
            expect(consoleWarnMock).toHaveBeenCalledTimes(1);
            expect(document.body.innerHTML).toEqual('');

            console.warn = consoleWarnOriginal;
            done();
          });
        });
      });
    });
  });
});