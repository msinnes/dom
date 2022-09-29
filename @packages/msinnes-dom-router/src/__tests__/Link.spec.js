/**
 * @jest-environment jsdom
 */
import { Link } from '../Link';

describe('Link', () => {
  it('should be a function', () => {
    expect(Link).toBeInstanceOf(Function);
  });

  it('should return  a link render', () => {
    expect(Link({}).signature).toEqual('a');
  });

  it('should add a \'#\' to a link\'s href prop', () => {
    expect(Link({}).props.href).toEqual('');
  });

  it('should navigate to a route if passed a \'to\' prop', done => {
    const to = '/about';
    const renderedLink = Link({ to });
    expect(window.location.href).toEqual('http://localhost/');
    const preventDefaultMock = jest.fn();
    const e = { preventDefault: preventDefaultMock };
    renderedLink.props.onclick(e);
    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
    setTimeout(() => {
      expect(window.location.href).toEqual('http://localhost/about');
      done();
    });
  });

  it('should pass all props to the rendered component', () => {
    const to = '/about';
    const prop1 = 'prop1';
    const prop2 = 'prop2';
    const renderedLink = Link({ to, prop1, prop2 });
    expect(renderedLink.props).toMatchObject({
      prop1: 'prop1',
      prop2: 'prop2',
    });
  });

  it('should not overwrite the href property', () => {
    const to = '/about';
    const prop1 = 'prop1';
    const prop2 = 'prop2';
    const renderedLink = Link({ to, prop1, prop2, href: 'not #' });
    expect(renderedLink.props).toMatchObject({
      prop1: 'prop1',
      prop2: 'prop2',
      href: '/about',
    });
  });

  it('should pass children to the link render', () => {
    const childRef = [];
    const to = '/about';
    const renderedLink = Link({ to, children: childRef});
    expect(renderedLink.children[0]).toBe(childRef);
  });
});