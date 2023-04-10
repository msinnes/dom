import * as DOM from '@msinnes/dom';
import { render } from '@msinnes/dom-testing-library';
import '@msinnes/dom-testing-library-jest';

import { Link } from '../Link';

describe('Link', () => {
  it('should be a function', () => {
    expect(Link).toBeInstanceOf(Function);
  });

  it('should navigate to a route if passed a \'to\' prop', () => {
    const useContextOriginal = DOM.useContext;
    const useContextMock = jest.fn();
    const navigateMock = jest.fn();
    useContextMock.mockReturnValue({ navigate: navigateMock, baseRoute: /\// });
    DOM.useContext = useContextMock;
    const to = '/about';
    const renderedLink = Link({ to });
    const preventDefaultMock = jest.fn();
    const e = { preventDefault: preventDefaultMock };
    renderedLink.props.onclick(e);
    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith(to);
    DOM.useContext = useContextOriginal;
  });

  it('should not navigate if the next route is not within the scope of the base route', () => {
    const useContextOriginal = DOM.useContext;
    const useContextMock = jest.fn();
    const navigateMock = jest.fn();
    useContextMock.mockReturnValue({ navigate: navigateMock, baseRoute: /\/path[/]?/ });
    DOM.useContext = useContextMock;
    let to = '/about';
    let renderedLink = Link({ to });
    const preventDefaultMock = jest.fn();
    const e = { preventDefault: preventDefaultMock };
    renderedLink.props.onclick(e);
    expect(preventDefaultMock).toHaveBeenCalledTimes(0);
    expect(navigateMock).toHaveBeenCalledTimes(0);
    to = '/path/about';
    renderedLink = Link({ to });
    renderedLink.props.onclick(e);
    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith(to);
    DOM.useContext = useContextOriginal;
  });

  it('should render without errors', () => {
    const screen = render(DOM.createElement(Link, { to: '/link' }, ['Link']));
    const link = screen.getByRole('link');
    expect(link).toBeOn(screen);
  });

  it('should render passed children', () => {
    const screen = render(DOM.createElement(Link, { to: '' }, ['Link']));
    expect(screen.queryAllByRole('link')).not.toBeOn(screen);
    expect(screen.getByText('Link')).toBeOn(screen);
  });

  it('should not pass an href prop to the link', () => {
    const screen = render(DOM.createElement(Link, { href: 'href', to: 'to' }, ['Link']));
    const link = screen.getByRole('link');
    expect(link).toBe(screen.container.firstChild);
    expect(link.href).toEqual('to');
    expect(link).toBeOn(screen);
    expect(link).toHaveAttribute('href', 'to');
    expect(link).not.toHaveAttribute('href', 'href');
  });
});
