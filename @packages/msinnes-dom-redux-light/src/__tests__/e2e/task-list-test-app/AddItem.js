import { useState } from '@msinnes/dom';
import { connect } from '@msinnes/dom-redux-light';

import { addItem as addItemAction } from './actions';

const AddItem = ({ addItem, setInputOpen }) => {
  const [value, setValue] = useState('');
  const handleInputChange = e => {
    const val = e.target.value;
    setValue(val);
  };

  const handleSubmit = () => {
    addItem(value);
    setInputOpen(false);
  };

  return (
    <>
      <input type="text" value={value} oninput={handleInputChange} />
      <div>
        <button type="button" onclick={handleSubmit}>Submit</button>
        <button type="button" onclick={() => setInputOpen(false)}>Close</button>
      </div>
    </>
  );
};

const mapDispatchToProps = dispatch => ({
  addItem: itemTitle => dispatch(addItemAction(itemTitle)),
});

const ConnectedAddItem = connect(undefined, mapDispatchToProps)(AddItem);

export { ConnectedAddItem as AddItem };