import * as DOM from '@msinnes/dom';
import { render } from '@msinnes/dom-testing-library';

import { ParamsContext } from '../../ParamsContext';
import { CaseResolver } from '../../resolver/CaseResolver';
import { RedirectResolver } from '../../resolver/RedirectResolver';

import * as navigateApi from '../../utils/navigate';

import {
  createResolver,
  findCurrentRouteChild,
  Switch,
  Case,
  Redirect,
} from '../Switch';

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
    expect(() => {
      createResolver(render);
    }).toThrow('ImplementationError: Switch components can only take Case and Redirect as children');
    let message;
  });

  it('should render the correct child when it is found', () => {
    const switchRender = (
      <Switch>
        <Case path="/home" render="Home" />
        <Case path="/about" render="About" />
      </Switch>
    );
    let screen = render(switchRender, { url: 'http://url.com/home'});
    expect(screen.container.textContent).toEqual('Home');
    screen = render(switchRender, { url: 'http://url.com/about' });
    expect(screen.container.textContent).toEqual('About');
  });

  it('should perform a startsWith match unless an exact prop is passed', () => {
    const withoutExactRender = (
      <Switch>
        <Case path="/" render="Home" />
        <Case path="/about" render="About" />
      </Switch>
    );
    let screen = render(withoutExactRender, { url: 'http://url.com/' });
    expect(screen.container.textContent).toEqual('Home');
    screen = render(withoutExactRender, { url: 'http://url.com/about' });
    expect(screen.container.textContent).toEqual('Home');

    const withExactRender = (
      <Switch>
        <Case path="/" render="Home" exact />
        <Case path="/about" render="About" />
      </Switch>
    );
    screen = render(withExactRender, { url: 'http://url.com/' });
    expect(screen.container.textContent).toEqual('Home');
    screen = render(withExactRender, { url: 'http://url.com/about' });
    expect(screen.container.textContent).toEqual('About');
  });

  it('should render case children if no render prop is passed', () => {
    const screen = render(<Switch><Case path="/" exact>Home</Case></Switch>, { url: 'http://url.com/' });
    expect(screen.container.textContent).toEqual('Home');
  });

  it('should return null and perform a redirect on the to param if the path param is matched', () => {
    const navigateOriginal = navigateApi.navigate;
    navigateApi.navigate = jest.fn();
    const screen = render(
      <Switch>
        <Case path="/" render="Home" exact />
        <Redirect path="/about" to="/" />
      </Switch>
    , { url: 'http://url.com/about' });
    expect(navigateApi.navigate).toHaveBeenCalledTimes(1);
    expect(navigateApi.navigate).toHaveBeenCalledWith('/')
    navigateApi.navigate = navigateOriginal;
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
    global.window = { location: { pathname: 'pathname' } };
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
    delete global.window;
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
    global.window = { location: { pathname: 'pathname' }  };
    const useMemoOriginal = DOM.useMemo;
    DOM.useMemo = jest.fn();
    const children = [];
    const result = Switch({ children });
    expect(result).toBe(null);
    expect(DOM.useMemo).toHaveBeenCalledTimes(1);
    expect(DOM.useMemo.mock.calls[0][0]).toBeInstanceOf(Function);
    DOM.useMemo = useMemoOriginal;
    delete global.window;
  });
});

describe('Case', () => {
  it('should be a function', () => {
    expect(Case).toBeInstanceOf(Function);
  });

  it('should throw an error if rendered', () => {
    expect(() => {
      Case({});
    }).toThrow('Case Components cannot be rendered')
  });
});

describe('Redirect', () => {
  it('should be a function', () => {
    expect(Redirect).toBeInstanceOf(Function);
  });

  it('should return null and perform a redirect when rendered', () => {
    const useEffectOriginal = DOM.useEffect;
    const navigateOriginal = navigateApi.navigate;
    DOM.useEffect = jest.fn();
    navigateApi.navigate = jest.fn();
    const result = Redirect({ to: '/about' });
    expect(result).toBe(null);
    expect(DOM.useEffect).toHaveBeenCalledTimes(1);
    const fn = DOM.useEffect.mock.calls[0][0];
    fn();
    expect(navigateApi.navigate).toHaveBeenCalledTimes(1);
    expect(navigateApi.navigate).toHaveBeenCalledWith('/about');
    DOM.useEffect = useEffectOriginal;
    navigateApi.navigate = navigateOriginal;
  });
});