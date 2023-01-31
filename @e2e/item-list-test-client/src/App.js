import { Component } from '@new-msinnes/dom';

import { AddWidget } from './AddWidget';
import { ItemList } from './ItemList';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = [];

    this.addItem = this.addItem.bind(this);
  }

  addItem(item) {
    this.setState([...this.state, item]);
  }

  render() {
    return (
      <>
        <div>Item List</div>
        {this.state.length ? <ItemList items={this.state} /> : null}
        <AddWidget addItem={this.addItem} />
      </>
    );
  }
}

export { App };