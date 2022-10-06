import classnames from 'classnames';

import { Router, Switch, Case, Redirect, Link, useParams } from '@msinnes/dom-router';

import './App.css';

const Home = () => 'Home Page';
const About = () => 'About Page';
const Params = () => {
  const { id } = useParams();
  return `Param: ${id}`;
};

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
      <NavItem to="/param/1" className={classnames({ active: location.pathname === '/param/1'})}>Params</NavItem>
      <NavItem to="/anything" className={classnames({ active: location.pathname === '/anything' })}>Anything</NavItem>
    </Nav>
  </div>
);

const Content = () => (
  <Switch>
    <Case path="/" render={<Home />} exact />
    <Case path="/about" render={<About />} />
    <Case path="/param/:id" render={<Params />} />
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