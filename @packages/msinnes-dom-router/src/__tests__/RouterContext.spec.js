import { useContext } from '@msinnes/dom';
import { render } from '@msinnes/dom-testing-library';

import { RouterContext } from '../RouterContext';

describe('RouterContext', () => {
  it('should expose a Provider and Consumer', () => {
    expect(RouterContext.Provider).toBeDefined();
    expect(RouterContext.Consumer).toBeDefined();
  });

  it('should set an initial value of \'not initialized\'', () => {
    const RouteDefault = () => {
      const ctx = useContext(RouterContext);
      return (
        <div>
          {ctx}
        </div>
      );
    };
    const screen = render(<RouteDefault />);
    expect(screen.getByText('not initialized')).toBeOnScreen(screen);
  });
});