/**
 * @jest-environment jsdom
 */
import { navigate } from '../navigate';

describe('navigate', () => {
  afterEach(() => {
    history.pushState({}, '', '/');
  });

  it('should be a function', () => {
    expect(navigate).toBeInstanceOf(Function);
  });

  it('should trigger a popstate event after navigating', () => {
    const mock = jest.fn();
    window.onpopstate = () => {
      mock(window.location.href);
    };
    expect(window.location.href).toEqual('http://localhost/');
    navigate('/home');
    expect(window.location.href).toEqual('http://localhost/home');
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith('http://localhost/home');
  });

  it('should accept an object { pathname, state } for input', () => {
    const mock = jest.fn();
    window.onpopstate = e => {
      mock(window.location.href, e.state.from);
    };
    expect(window.location.href).toEqual('http://localhost/');
    navigate({ pathname: '/home', state: { from: 'from' } });
    expect(window.location.href).toEqual('http://localhost/home');
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith('http://localhost/home', 'from');
  });
});