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
    <NavItem to="/path">Home</NavItem>
    <NavItem to="/path/about">About</NavItem>
    <NavItem to="/path/param/1">Params</NavItem>
    <NavItem to="/path/anything">Anything</NavItem>
  </Nav>
);

const Content = () => (
  <Switch>
    <Case path="/path" render={<Home />} exact />
    <Case path="/path/about" render={<About />} />
    <Case path="/path/param/:id" render={<Params />} />
    <Redirect path="*" to="/path/about" />
  </Switch>
);

const App = () => (
  <Router basePath="/path">
    <Header />
    <Content />
  </Router>
);

export { App };