/**
 * @jest-environment jsdom
 */
import { renderApp } from '@msinnes/dom';

import { Router, Switch, Case, Redirect, Link } from '..';

describe('e2e', () => {
  const Home = () => 'Home';
  const About = () => 'About';

  const Nav = ({ children }) => (
    <ul>
      {children}
    </ul>
  );

  const NavItem = ({ children, ...rest }) => <li><Link {...rest}>{children}</Link></li>;

  const Header = () => (
    <Nav>
      <NavItem to="/">Home</NavItem>
      <NavItem to="/about">About</NavItem>
      <NavItem to="/anything">Anything</NavItem>
    </Nav>
  );

  const Content = () => (
    <Switch>
      <Case path="/" render={<Home />} exact />
      <Case path="/about" render={<About />}/>
      <Redirect path="*" to="/about" />
    </Switch>
  );

  const App = () => (
    <Router>
      <Header />
      <Content />
    </Router>
  );

  beforeEach(done => {
    renderApp(<App />, document.body);
    setTimeout(done);
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should be rendered correctly', () => {
    expect(document.body.childNodes.length).toEqual(2);

    // Nav
    expect(document.body.childNodes[0].tagName).toEqual('UL');
    expect(document.body.childNodes[0].childNodes.length).toEqual(3);
    expect(document.body.childNodes[0].childNodes[0].tagName).toEqual('LI');
    expect(document.body.childNodes[0].childNodes[0].innerHTML).toEqual('<a href=\"/\">Home</a>');
    expect(document.body.childNodes[0].childNodes[1].tagName).toEqual('LI');
    expect(document.body.childNodes[0].childNodes[1].innerHTML).toEqual('<a href=\"/about\">About</a>');
    expect(document.body.childNodes[0].childNodes[2].tagName).toEqual('LI');
    expect(document.body.childNodes[0].childNodes[2].innerHTML).toEqual('<a href=\"/anything\">Anything</a>');

    // Content
    expect(document.body.childNodes[1].textContent).toBe('Home');
  });

  it('should navigate when \'About\' is clicked', done => {
    document.body.childNodes[0].childNodes[1].childNodes[0].click();
    setTimeout(() => {
      setTimeout(() => {
        setTimeout(() => {
          // Nav
          expect(document.body.childNodes[0].tagName).toEqual('UL');
          expect(document.body.childNodes[0].childNodes.length).toEqual(3);
          expect(document.body.childNodes[0].childNodes[0].tagName).toEqual('LI');
          expect(document.body.childNodes[0].childNodes[0].innerHTML).toEqual('<a href=\"/\">Home</a>');
          expect(document.body.childNodes[0].childNodes[1].tagName).toEqual('LI');
          expect(document.body.childNodes[0].childNodes[1].innerHTML).toEqual('<a href=\"/about\">About</a>');
          expect(document.body.childNodes[0].childNodes[2].tagName).toEqual('LI');
          expect(document.body.childNodes[0].childNodes[2].innerHTML).toEqual('<a href=\"/anything\">Anything</a>');

          // Content
          expect(document.body.childNodes[1].textContent).toBe('About');
          done();
        });
      });
    });
  });

  it('should navigate to \'About\' when \'Anything\' is clicked', () => {
    document.body.childNodes[0].childNodes[2].childNodes[0].click();
    setTimeout(() => {
      setTimeout(() => {
        // Nav
        expect(document.body.childNodes[0].tagName).toEqual('UL');
        expect(document.body.childNodes[0].childNodes.length).toEqual(3);
        expect(document.body.childNodes[0].childNodes[0].tagName).toEqual('LI');
        expect(document.body.childNodes[0].childNodes[0].innerHTML).toEqual('<a href=\"/\">Home</a>');
        expect(document.body.childNodes[0].childNodes[1].tagName).toEqual('LI');
        expect(document.body.childNodes[0].childNodes[1].innerHTML).toEqual('<a href=\"/about\">About</a>');
        expect(document.body.childNodes[0].childNodes[2].tagName).toEqual('LI');
        expect(document.body.childNodes[0].childNodes[2].innerHTML).toEqual('<a href=\"/anything\">Anything</a>');

        // Content
        expect(document.body.childNodes[1].textContent).toBe('About');
        done();
      });
    });
  });

  it('should navigate back to \'Home\' from \'About\'', () => {
    document.body.childNodes[0].childNodes[1].childNodes[0].click();
    setTimeout(() => {
      setTimeout(() => {
        expect(document.body.childNodes[1].textContent).toBe('About');
        document.body.childNodes[0].childNodes[0].childNodes[0].click();
        setTimeout(() => {
          setTimeout(() => {
            expect(document.body.childNodes[1].textContent).toBe('Home');
            done();
          });
        });
      });
    });
  });
});