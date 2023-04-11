import * as DOM from '@msinnes/dom';
import { useParams, Case, Redirect, Switch, Link, Router } from '@msinnes/dom-router';

const Home = () => <div>Home</div>;
const About = () => <div>About</div>;
const Params = () => {
  const { id } = useParams();
  return <div>Param: {id}</div>;
}

const Nav = ({ children }) => <ul>{children}</ul>;

const NavItem = ({ children, ...rest }) => (
  <li>
    <Link {...rest}>{children}</Link>
  </li>
);

const Header = () => (
  <Nav>
    <NavItem to='/subrouted'>Home</NavItem>
    <NavItem to='/subrouted/about'>About</NavItem>
    <NavItem to='/subrouted/param/1'>Params</NavItem>
    <NavItem to='/subrouted/anything'>Anything</NavItem>
  </Nav>
);

const Content = () => (
  <Switch>
    <Case path="/subrouted" render={<Home />} exact />
    <Case path="/subrouted/about" render={<About />} />
    <Case path="/subrouted/param/:id" render={<Params />} />
    <Redirect path="*" to="/subrouted/about" />
  </Switch>
);

const App = () => (
  <Router basePath="/subrouted">
    <Header />
    <Content />
  </Router>
);

export { App };