import classnames from 'classnames';

import { Router, Switch, Case, Redirect, Link } from '@msinnes/dom-router';

import './App.css';

const Home = () => 'Home Page';
const About = () => 'About Page';

const Nav = ({ className, children }) => (
  <ul className={className}>
    {children}
  </ul>
);

const NavItem = ({ children, ...rest }) => <li><Link {...rest}>{children}</Link></li>;

const Header = () => (
  <div>
    <Nav className="horizontal gray">
      <NavItem to="/" className={classnames({ active: location.pathname === '/' })}>Home</NavItem>
      <NavItem to="/about" className={classnames({ active: location.pathname === '/about' })}>About</NavItem>
      <NavItem to="/anything" className={classnames({ active: location.pathname === '/anything' })}>Anything</NavItem>
    </Nav>
  </div>
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

export { App };