import { Component } from '@new-msinnes/dom';

import { AddButton } from './AddButton';
import { AddForm } from './AddForm';

class AddWidget extends Component {
  componentWillUnmount() {
    console.log('unmount');
  }

  constructor(props) {
    super(props);

    this.state = false;

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.onsubmit = this.onsubmit.bind(this);
  }

  close() {
    this.setState(false);
  }

  open() {
    this.setState(true);
  }

  onsubmit(item) {
    this.props.addItem(item);
    this.close();
  }

  render() {
    return this.state ? (
      <AddForm onsubmit={this.onsubmit} />
    ) : (
      <AddButton onclick={this.open} />
    );
  }
}

export { AddWidget };