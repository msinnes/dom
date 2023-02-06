import { connect } from '@new-msinnes/dom-redux-light';
import { Link } from '@new-msinnes/dom-router';

import { logout as logoutAction } from '../actions';

const LoggedOutComponent = () => (
  <div>
    <Link to="/login">Login</Link>
  </div>
);

const LoggedInComponent = ({ username, logout }) => (
  <div>
    <div>Welcome back {username}</div>
    <div><button type="button" onclick={logout}>Log Out</button></div>
  </div>
);

const HomePage = ({ auth, logout }) => (
  <>
    {auth.isAuthorized ? <LoggedInComponent username={auth.user.username} logout={logout} /> : <LoggedOutComponent />}
    <div>Home Page</div>
  </>
);

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logoutAction()),
});

const ConnectedHomePage = connect(mapStateToProps, mapDispatchToProps)(HomePage);

export { ConnectedHomePage as HomePage };