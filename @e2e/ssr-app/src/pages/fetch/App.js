import * as DOM from '@msinnes/dom';
import { connect } from '@msinnes/dom-redux-light';

const getName = () => fetch('url');
const setNameAction = name => {
    return ({
      type: 'SET_NAME',
      name,
    });
};

const reducer = (action, state = '') => {
  if (action.type = 'SET_NAME') return action.name;
  return state;
};

const Name = ({ name, setName }) => {
  DOM.useEffect(() => {
    if (!name) getName().then(data => data.text()).then(name => setName(name));
  }, []);
  return name && name.length ? name : 'no name';
};
const ConnectedName = connect(state => ({
  name: state,
}), dispatch => ({
  setName: name => dispatch(setNameAction(name)),
}))(Name);

const App = () => (
  <ConnectedName />
);

export { App, reducer };
