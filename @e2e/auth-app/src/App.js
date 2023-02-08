import { Router, Switch, Case, Redirect } from '@msinnes/dom-router';
import { combineReducers, createStore, StoreProvider } from '@msinnes/dom-redux-light';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';

const users = {
  'mike': {
    username: 'mike',
    password: 'password1',
  },
  'george': {
    username: 'george',
    password: 'password2',
  },
};

const authReducer = (action = {}, state = {}) => {
  switch(action.type) {
    case 'LOGIN':
      const { username, password } = action.data;
      const user = users[username];
      if (user && user.password === password) {
        return {
          isAuthorized: true,
          user,
        };
      }
      return state;
    case 'LOGOUT':
      return {};
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  auth: authReducer,
});

const store = createStore(rootReducer);

const App = () => {
  return (
    <StoreProvider store={store}>
      <Router>
        <Switch>
          <Case
            path="/"
            render={<HomePage />}
            exact
          />
          <Case
            path="/login"
            render={<LoginPage />}
          />
          <Redirect
            path="*"
            to="/"
          />
        </Switch>
      </Router>
    </StoreProvider>
  );
};

export { App };