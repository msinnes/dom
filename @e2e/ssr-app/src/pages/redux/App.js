import { connect } from '@new-msinnes/dom-redux-light';

const App = ({ text }) => text;

const mapStateToProps = state => ({
  text: state,
});

const connectedApp = connect(mapStateToProps)(App);

export { connectedApp as App };
