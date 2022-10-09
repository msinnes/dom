import { render } from '@msinnes/dom-testing-library';

import { Link } from '../Link';

import * as navigateApi from '../../utils/navigate';

navigateApi.navigate = jest.fn();

describe('Link', () => {
  afterEach(jest.resetAllMocks);

  it('should be a function', () => {
    expect(Link).toBeInstanceOf(Function);
  });

  it('should navigate to a route if passed a \'to\' prop', () => {
    const to = '/about';
    const renderedLink = Link({ to });
    const preventDefaultMock = jest.fn();
    const e = { preventDefault: preventDefaultMock };
    renderedLink.props.onclick(e);
    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
    expect(navigateApi.navigate).toHaveBeenCalledTimes(1);
    expect(navigateApi.navigate).toHaveBeenCalledWith(to);
  });

  it('should render without errors', () => {
    const screen = render(
      <Link to="/link">Link</Link>
    );
    const link = screen.getByRole('link');
    expect(link).toBeOnScreen(screen);
  });

  it('should render passed children', () => {
    const screen = render(
      <Link to="">Link</Link>
    );
    expect(screen.queryAllByRole('link')).not.toBeOnScreen(screen);
    expect(screen.getByText('Link')).toBeOnScreen(screen);
  });

  it('should not pass an href prop to the link', () => {
    const screen = render(
      <Link href="href" to="to">Link</Link>
    );
    const link = screen.getByRole('link');
    expect(link).toBeOnScreen(screen);
    expect(link).toHaveAttribute('href', 'to');
    expect(link).not.toHaveAttribute('href', 'href');
  });

  it('should pass attributes to the anchor', () => {
    const screen = render(
      <Link prop1="prop1" prop2="prop2" to="to">Link</Link>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttributes({
      prop1: 'prop1',
      prop2: 'prop2',
    });
  });
});