import { render } from '@msinnes/dom-testing-library';
import { App as BasicTestApp } from './basic-test-app';
import { App as BaseRouteTestApp } from './base-route-test-app';

import * as api from '..';

const { Router, Switch, Case, Redirect, Link } = api;

describe('index', () => {
  it('should expose Router', () => {
    expect(api.Router).toBeDefined();
  });

  it('should expose a Switch, Case, and Redirect', () => {
    expect(api.Switch).toBeDefined();
    expect(api.Case).toBeDefined();
    expect(api.Redirect).toBeDefined();
  });

  it('should expose a Link', () => {
    expect(api.Link).toBeDefined();
  });

  it('should expose hooks', () => {
    expect(api.useLocation).toBeDefined();
    expect(api.useNavigate).toBeDefined();
    expect(api.useParams).toBeDefined();
  });
});

describe('e2e', () => {
  describe('basic test app', () => {
    let screen;
    beforeEach(() => {
      screen = render(<BasicTestApp />, { url: 'http://url.com/'});
    });

    it('should render 4 links', () => {
      const links = screen.getAllByRole('link');
      expect(links.length).toEqual(4);
      expect(links).toBeOnScreen(screen);
    });

    it('should be on the home page', () => {
      const LinkAndDiv = screen.getAllByText('Home');
      expect(LinkAndDiv.length).toEqual(2);
      expect(LinkAndDiv).toBeOnScreen(screen);
    });

    it('should navigate to the about page', () => {
      const AboutLink = screen.getByText('About');
      AboutLink.click();
      expect(screen.getAllByText('Home').length).toEqual(1);
      expect(screen.getAllByText('About').length).toEqual(2);
    });

    it('should navigate to the params page', () => {
      const ParamLink = screen.getByText('Params');
      ParamLink.click();
      expect(screen.getAllByText('Home').length).toEqual(1);
      expect(screen.getAllByText('Params').length).toEqual(1);
      expect(screen.getAllByText('Param: 1').length).toEqual(1);
    });

    it('should redirect to about when anything is clicked', () => {
      const AnythingLink = screen.getByText('Anything');
      AnythingLink.click();
      expect(screen.getAllByText('Home').length).toEqual(1);
      expect(screen.getAllByText('About').length).toEqual(2);
    });
  });

  describe('base route test app', () => {
    let screen;
    beforeEach(() => {
      screen = render(<BaseRouteTestApp />, { url: 'http://url.com/path'});
    });

    it('should render 4 links', () => {
      const links = screen.getAllByRole('link');
      expect(links.length).toEqual(4);
      expect(links).toBeOnScreen(screen);
    });

    it('should be on the home page', () => {
      const LinkAndDiv = screen.getAllByText('Home');
      expect(LinkAndDiv.length).toEqual(2);
      expect(LinkAndDiv).toBeOnScreen(screen);
    });

    it('should navigate to the about page', () => {
      const AboutLink = screen.getByText('About');
      AboutLink.click();
      expect(screen.getAllByText('Home').length).toEqual(1);
      expect(screen.getAllByText('About').length).toEqual(2);
    });

    it('should navigate to the params page', () => {
      const ParamLink = screen.getByText('Params');
      ParamLink.click();
      expect(screen.getAllByText('Home').length).toEqual(1);
      expect(screen.getAllByText('Params').length).toEqual(1);
      expect(screen.getAllByText('Param: 1').length).toEqual(1);
    });

    it('should redirect to about when anything is clicked', () => {
      const AnythingLink = screen.getByText('Anything');
      AnythingLink.click();
      expect(screen.getAllByText('Home').length).toEqual(1);
      expect(screen.getAllByText('About').length).toEqual(2);
    });
  });
});
