/**
 * @jest-environment jsdom
 */
import { Component, renderApp, createElement } from '../../..';

describe('class effects with conditions', () => {
  it('should not run domEffects on class components if effectConditions is an empty array', done => {
    class DomEffectOnce extends Component {
      state = 0;

      constructor(props) {
        super(props);

        this.effect = this.effect.bind(this);
        this.effectConditions = this.effectConditions.bind(this);
        this.incrementState = this.incrementState.bind(this);
      }

      effect() {
        document.title = 'set title - ' + this.state;
      }

      effectConditions() {
        return [];
      }

      incrementState() {
        this.setState(++this.state);
      }

      render() {
        return createElement('button', { onclick: this.incrementState }, ['button text - ' + this.state]);
      }
    }
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