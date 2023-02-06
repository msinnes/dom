import { connect } from '@new-msinnes/dom-redux-light';
import { Redirect } from '@new-msinnes/dom-router';

import { Form, Input } from '../components/Form';
import { login as loginAction } from '../actions';

const LoginForm = ({ auth, login }) => {
  const handleSubmit = formValues => {
    login(formValues);
  };

  if (auth.isAuthorized) return <Redirect to="/" />;

  return (
    <Form
      title="Login"
      onSubmit={handleSubmit}
      initialValues={{
        username: '',
        password: '',
      }}
    >
      <Input
        type="text"
        name="username"
        label="Username"
        required
      />
      <Input
        type="password"
        name="password"
        label="Password"
        required
      />
    </Form>
  );
};

const LoginPage = props => (
  <LoginForm {...props} />
);

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  login: user => dispatch(loginAction(user)),
});

const ConnectedLoginPage = connect(mapStateToProps, mapDispatchToProps)(LoginPage);
export { ConnectedLoginPage as LoginPage };