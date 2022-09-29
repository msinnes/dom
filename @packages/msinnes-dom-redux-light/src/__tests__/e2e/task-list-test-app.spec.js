/**
 * @jest-environment jsdom
 */
import { renderApp } from '@msinnes/dom';

import { App } from './item-list-test-app';

describe('index.task-list-test-app.e2e', () => {
  beforeEach(done => {
    renderApp(<App />, document.body);
    setTimeout(done);
  });

  afterEach(() => {
    while(document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should render a basic task list', () => {
    expect(document.body.innerHTML).toEqual('<div>No Items Yet</div><button type=\"button\">Add Item</button>');
  });
});