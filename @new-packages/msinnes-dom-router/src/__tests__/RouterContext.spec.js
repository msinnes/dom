import * as DOM from '@new-msinnes/dom';
import { render } from '@new-msinnes/dom-testing-library';
import '@new-msinnes/dom-testing-library-jest';

import { RouterContext } from '../RouterContext';

describe('RouterContext', () => {
  it('should expose a Provider and Consumer', () => {
    expect(RouterContext.Provider).toBeDefined();
    expect(RouterContext.Consumer).toBeDefined();
  });

  it('should set an initial value of \'not initialized\'', () => {
    const RouteDefault = () => {
      const ctx = DOM.useContext(RouterContext);
      return ctx;
    };
    const screen = render(DOM.createElement(RouteDefault));
    expect(screen.getByText('not initialized')).toBeOn(screen);
  });
});
