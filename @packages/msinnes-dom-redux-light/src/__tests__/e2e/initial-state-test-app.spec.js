/**
 * @jest-environment jsdom
 */
import { renderApp } from '@msinnes/dom';

import { App } from './initial-state-test-app';

describe('index.initial-state-test-app.e2e', () => {
  beforeEach(done => {
    renderApp(<App />, document.body);
    setTimeout(done);
  });

  afterEach(() => {
    while(document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should render', () => {
    expect(document.body.innerHTML).toEqual('redux text');
  });
});