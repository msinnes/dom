import { Router, Switch, Case, Redirect, Link, useParams } from '../..';

const Home = () => <div>Home</div>;
const About = () => <div>About</div>;
const Params = () => {
  const { id } = useParams();
  return <div>Param: {id}</div>;
};

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
    <NavItem to="/param/1">Params</NavItem>
    <NavItem to="/anything">Anything</NavItem>
  </Nav>
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