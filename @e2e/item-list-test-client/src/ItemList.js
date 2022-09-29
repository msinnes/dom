const Item = ({ text }) => <li>{text}</li>;

const ItemList = ({ items }) => (
  <ul>
    {items.map(item => <Item text={item} />)}
  </ul>
);

export { ItemList };
