import { connect } from '../../connect';

import {
  completeItem as completeItemAction,
  deleteItem as deleteItemAction,
} from './actions';

const ListItem = ({ item, completeItem, deleteItem }) => {
  return (
    <li>
      <span>{item.completed ? <del>{item.title}</del> : item.title}</span>
      <button type="button" onclick={() => completeItem(item)}>Complete</button>
      <button type="button" onclick={() => deleteItem(item)}>Delete</button>
    </li>
  );
};

const mapDispatchToProps = dispatch => ({
  completeItem: item => dispatch(completeItemAction(item)),
  deleteItem: item => dispatch(deleteItemAction(item)),
})

const ConnectedListItem = connect(undefined, mapDispatchToProps)(ListItem);

const List = ({ items }) => (
  <ul>
    {items.map(item => (
      <ConnectedListItem item={item} />
    ))}
  </ul>
);

const ItemList = ({ items, setInputOpen }) => {
  return (
    <>
      <div>{items.length ? <List items={items} /> : 'No Items Yet'}</div>
      <button type="button" onclick={() => setInputOpen(true)}>Add Item</button>
    </>
  );
};

const mapStateToProps = state => ({ items: state });

const ConnectedItemList = connect(mapStateToProps)(ItemList);

export { ConnectedItemList as ItemList };