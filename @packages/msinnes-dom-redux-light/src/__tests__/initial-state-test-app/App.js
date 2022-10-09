import { connect } from '../../index';

const App = ({ text }) => {
  return text;
};

const mapStateToProps = state => ({
  text: state,
});

const connectedApp = connect(mapStateToProps)(App);

export { connectedApp as App };