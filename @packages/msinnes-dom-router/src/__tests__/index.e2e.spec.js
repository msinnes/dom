import { render } from '@msinnes/dom-testing-library';
import * as DOM from '@msinnes/dom';
import '@msinnes/dom-testing-library-jest';

import * as api from '..';

describe('e2e', () => {
  describe('basic app', () => {
    const Home = () => DOM.createElement('div', {}, ['Home']);
    const About = () => DOM.createElement('div', {}, ['About']);
    const Params = () => {
      const { id } = api.useParams();
      return DOM.createElement('div', {}, [`Param: ${id}`]);
    };

    const Nav = ({ children }) => {
      return DOM.createElement('ul', {}, [children]);
    };

    const NavItem = ({ children, ...rest }) => DOM.createElement('li', {}, [
      DOM.createElement(api.Link, {...rest}, [children]),
    ]);

    const Header = () => DOM.createElement(Nav, {}, [
      DOM.createElement(NavItem, { to: '/' }, ['Home']),
      DOM.createElement(NavItem, { to: '/about' }, ['About']),
      DOM.createElement(NavItem, { to: '/param/1' }, ['Params']),
      DOM.createElement(NavItem, { to: '/anything' }, ['Anything']),
    ]);

    const Content = () => DOM.createElement(api.Switch, {}, [
      DOM.createElement(api.Case, { path: '/', render: DOM.createElement(Home), exact: true }),
      DOM.createElement(api.Case, { path: '/about', render: DOM.createElement(About) }),
      DOM.createElement(api.Case, { path: '/param/:id', render: DOM.createElement(Params) }),
      DOM.createElement(api.Redirect, { path: '*', to: '/about' }),
    ]);

    const App = () => DOM.createElement(api.Router, {}, [
      DOM.createElement(Header),
      DOM.createElement(Content),
    ]);

    let screen;
    beforeEach(() => {
      screen = render(DOM.createElement(App), { url: 'http://url.com/'});
    });

    it('should render 4 links', () => {
      const links = screen.getAllByRole('link');
      expect(links.length).toEqual(4);
      expect(links).toBeOn(screen);
    });

    it('should be on the home page', () => {
      const LinkAndDiv = screen.getAllByText('Home');
      expect(LinkAndDiv.length).toEqual(2);
      expect(LinkAndDiv).toBeOn(screen);
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

  describe('base route app', () => {
    const Home = () => DOM.createElement('div', {}, ['Home']);
    const About = () => DOM.createElement('div', {}, ['About']);
    const Params = () => {
      const { id } = api.useParams();
      return DOM.createElement('div', {}, [`Param: ${id}`]);
    };

    const Nav = ({ children }) => {
      return DOM.createElement('ul', {}, [children]);
    };

    const NavItem = ({ children, ...rest }) => DOM.createElement('li', {}, [
      DOM.createElement(api.Link, {...rest}, [children]),
    ]);

    const Header = () => DOM.createElement(Nav, {}, [
      DOM.createElement(NavItem, { to: '/path' }, ['Home']),
      DOM.createElement(NavItem, { to: '/path/about' }, ['About']),
      DOM.createElement(NavItem, { to: '/path/param/1' }, ['Params']),
      DOM.createElement(NavItem, { to: '/path/anything' }, ['Anything']),
    ]);

    const Content = () => DOM.createElement(api.Switch, {}, [
      DOM.createElement(api.Case, { path: '/path', render: DOM.createElement(Home), exact: true }),
      DOM.createElement(api.Case, { path: '/path/about', render: DOM.createElement(About) }),
      DOM.createElement(api.Case, { path: '/path/param/:id', render: DOM.createElement(Params) }),
      DOM.createElement(api.Redirect, { path: '*', to: '/path/about' }),
    ]);

    const App = () => DOM.createElement(api.Router, { basePath: '/path' }, [
      DOM.createElement(Header),
      DOM.createElement(Content),
    ]);

    let screen;
    beforeEach(() => {
      screen = render(DOM.createElement(App), { url: 'http://url.com/path'});
    });

    it('should render 4 links', () => {
      const links = screen.getAllByRole('link');
      expect(links.length).toEqual(4);
      expect(links).toBeOn(screen);
    });

    it('should be on the home page', () => {
      const LinkAndDiv = screen.getAllByText('Home');
      expect(LinkAndDiv.length).toEqual(2);
      expect(LinkAndDiv).toBeOn(screen);
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
