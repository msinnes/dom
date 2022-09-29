/**
 * @jest-environment jsdom
 */
 import { renderApp, useState, useEffect, createElement } from '../../..';

describe('class effects with conditions', () => {
  it('should not run domEffects on class components if effectConditions is an empty array', done => {
    const DomEffectOnce = () => {
      let [state, setState] = useState(0);
      const incrementState = () => {
        setState(++state);
      };

      useEffect(() => {
        document.title = 'set title - ' + state;
      }, []);

      return createElement('button', {
        onclick: incrementState,
      }, ['button text - ' + state]);
    };

    const render = createElement(DomEffectOnce);
    renderApp(render, document.body);
    setTimeout(() => {
      setTimeout(() => {
        expect(document.title).toEqual('set title - 0');
        expect(document.body.firstChild.innerHTML).toEqual('button text - 0');

        document.body.firstChild.click();
        setTimeout(() => {
          setTimeout(() => {
            setTimeout(() => {
              setTimeout(() => {
                setTimeout(() => {
                  expect(document.title).toEqual('set title - 0');
                  expect(document.body.firstChild.innerHTML).toEqual('button text - 1');
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