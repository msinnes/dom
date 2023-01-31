import { Component } from '@new-msinnes/dom';

class AddForm extends Component {
  constructor(props) {
    super(props);

    this.state = '';
    this.oninput = this.oninput.bind(this);
    this.onsubmit = this.onsubmit.bind(this);
  }

  oninput(e) {
    this.setState(e.target.value);
  }

  onsubmit() {
    this.props.onsubmit(this.state);
    this.setState('');
  }

  render() {
    return (
      <>
        <input type="text" oninput={this.oninput} value={this.state} />
        <button type="button" onclick={this.onsubmit}>Add item</button>
      </>
    );
  }
}

export { AddForm };
