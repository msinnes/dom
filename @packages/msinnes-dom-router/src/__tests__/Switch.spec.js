/**
 * @jest-environment jsdom
 */
import { CaseResolver } from '../resolver/CaseResolver';
import { RedirectResolver } from '../resolver/RedirectResolver';

import {
  createResolver,
  findCurrentRouteChild,
  Switch,
  Case,
  Redirect,
} from '../Switch';

jest.mock('@msinnes/dom', () => {
  let useMemoVal;
  const module = {
    useMemo: fn => {
      let value = useMemoVal;
      if (!useMemoVal) value = fn();
      return value;
    },
  };
  return module;
});

afterEach(() => {
  window.history.pushState({}, '', '/');
});

describe('createResolver', () => {
  it('should be a function', () => {
    expect(createResolver).toBeInstanceOf(Function);
  });

  it('should return a case resolver if the input render has a case signature', () => {
    const render = { signature: Case, props: {} };
    const resolver = createResolver(render);
    expect(resolver).toBeInstanceOf(CaseResolver);
  });

  it('should return a redirect resolver if the input render has a redirect signature', () => {
    const render = { signature: Redirect, props: {} };
    const resolver = createResolver(render);
    expect(resolver).toBeInstanceOf(RedirectResolver);
  });

  it('should throw an error if the input signature is not recognized', () => {
    class NotRecognized {}
    const render = { signature: NotRecognized, props: {} };
    let message;
    try {
      createResolver(render);
    } catch (e) {
      message = e.message;
    }
    expect(message).toBeDefined();
    expect(message).toEqual('ImplementationError: Switch components can only take Case and Redirect as children');
  });
});

describe('findCurrentRouteChild', () => {
  let resolver1;
  let resolver1TestMock;
  let resolver1ResolveMock;
  const resolver1ResolveResult = {};
  let resolver2;
  let resolver2TestMock;
  let resolver2ResolveMock;
  const resolver2ResolveResult = {};
  beforeEach(() => {
    resolver1TestMock = jest.fn();
    resolver1TestMock.mockImplementation(() => false);
    resolver1ResolveMock = jest.fn();
    resolver1ResolveMock.mockImplementation(() => resolver1ResolveResult);
    resolver1 = { test: resolver1TestMock, resolve: resolver1ResolveMock };

    resolver2TestMock = jest.fn();
    resolver2TestMock.mockImplementation(() => false);
    resolver2ResolveMock = jest.fn();
    resolver2ResolveMock.mockImplementation(() => resolver2ResolveResult);
    resolver2 = { test: resolver2TestMock, resolve: resolver2ResolveMock };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be a function', () => {
    expect(findCurrentRouteChild).toBeInstanceOf(Function);
  });

  it('should return null of no route child is found', () => {
    const result = findCurrentRouteChild([]);
    expect(result).toBe(null);
  });

  it('should default resolvers to an empty array if nothing is passed', () => {
    const result = findCurrentRouteChild();
    expect(result).toBe(null);
  });

  it('should call all resolver.test methods with window.location.pathname', () => {
    const result = findCurrentRouteChild([resolver1, resolver2]);
    expect(result).toBe(null);
    expect(resolver1TestMock).toHaveBeenCalledTimes(1);
    expect(resolver1TestMock).toHaveBeenCalledWith(window.location.pathname);
    expect(resolver2TestMock).toHaveBeenCalledTimes(1);
    expect(resolver2TestMock).toHaveBeenCalledWith(window.location.pathname);
  });

  it('should return a resolver.resolve if resolver.test returns true', () => {
    resolver1TestMock.mockImplementationOnce(() => true);
    let result = findCurrentRouteChild([resolver1, resolver2]);
    expect(result).toBe(resolver1ResolveResult);
    resolver2TestMock.mockImplementationOnce(() => true);
    result = findCurrentRouteChild([resolver1, resolver2]);
    expect(result).toBe(resolver2ResolveResult);
  });
});

describe('Switch', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should be a function', () => {
    expect(Switch).toBeInstanceOf(Function);
  });

  it('should return null if no route is found', () => {
    const children = [];
    const result = Switch({ children });
    expect(result).toBe(null);
  });

  it('should return the correct render from the children prop', () => {
    const child1 = {};
    const child2 = {};
    const children = [
      <Case path="/home" render={child1} />,
      <Case path="/about" render={child2} />,
    ];
    window.history.pushState({}, '', '/home');
    let render = Switch({ children });
    expect(render).toBe(child1);
    window.history.pushState({}, '', '/about');
    render = Switch({ children });
    expect(render).toBe(child2);
  });

  it('should take a single wildcard regex', () => {
    const child1 = {};
    const child2 = {};
    let children = [
      <Case path="*" render={child1} />,
      <Case path="/about" render={child2} />,
    ];
    let render = Switch({ children });
    expect(render).toBe(child1);
    window.history.pushState({}, '', '/about');
    render = Switch({ children });
    expect(render).toBe(child1);
  });

  it('should perform a startsWith match unless an exact prop is passed', () => {
    const child1 = {};
    const child2 = {};
    let children = [
      <Case path="/" render={child1} />,
      <Case path="/about" render={child2} />,
    ];
    let render = Switch({ children });
    expect(render).toBe(child1);
    window.history.pushState({}, '', '/about');
    render = Switch({ children });
    expect(render).toBe(child1);

    children = [
      <Case path="/" render={child1} exact />,
      <Case path="/about" render={child2} />,
    ];
    window.history.pushState({}, '', '/');
    render = Switch({ children });
    expect(render).toBe(child1);
    window.history.pushState({}, '', '/about');
    render = Switch({ children });
    expect(render).toBe(child2);
  });

  it('should return null and perform a redirect on the to param if the path param is matched', () => {
    const child1 = {};
    let children = [
      <Case path="/" render={child1} exact />,
      <Redirect path="/about" to="/" />,
    ];
    window.history.pushState({}, '', '/about');
    const render = Switch({ children });
    expect(render).toBe(null);
    setTimeout(() => {
      expect(window.location.href).toEqual('http://localhost/');
    });
  });

  it('should render case children if no render prop is passed', () => {
    const childrenRef = {};
    const children = [
      <Case path="/" children={childrenRef} exact />,
    ];
    const render = Switch({ children });
    expect(render).toBe(childrenRef);
  });
});

describe('Case', () => {
  it('should be a function', () => {
    expect(Case).toBeInstanceOf(Function);
  });

  it('should throw an error if rendered', () => {
    let error;
    try {
      Case();
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.message).toEqual('Case Components cannot be rendered');
  });
});

describe('Redirect', () => {
  it('should be a function', () => {
    expect(Redirect).toBeInstanceOf(Function);
  });

  it('should return null and perform a redirect when rendered', done => {
    const result = Redirect({ to: '/about' });
    expect(result).toBe(null);
    setTimeout(() => {
      expect(window.location.href).toEqual('http://localhost/about');
      done();
    });
  });
});