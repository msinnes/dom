/**
 * @jest-environment jsdom
 */
import { renderApp } from '@msinnes/dom';

import { App } from './test-app';

describe('e2e', () => {
  beforeEach(done => {
    renderApp(<App />, document.body);
    setTimeout(done);
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should resolve route params', done => {
    document.body.childNodes[0].childNodes[2].childNodes[0].click();
    setTimeout(() => {
      setTimeout(() => {
        setTimeout(() => {
          expect(document.body.childNodes[1].textContent).toBe('Param: 1');
          document.body.childNodes[0].childNodes[0].childNodes[0].click();
          setTimeout(() => {
            setTimeout(() => {
              setTimeout(() => {
                expect(document.body.childNodes[1].textContent).toBe('Home');
                done();
              });
            });
          });
        });
      });
    });
  });
});