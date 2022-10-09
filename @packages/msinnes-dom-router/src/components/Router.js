import { Component } from '@msinnes/dom';

// TODO: this should resolve a base route
// TODO: this should expose a provided Router context
class Router extends Component {
  constructor(props) {
    super(props);

    this.state = 0;

    this.onPopstate = this.onPopstate.bind(this);
  }

  componentDidMount() {
    window.addEventListener('popstate', this.onPopstate);
  }

  onPopstate() {
    this.setState(state => ++state);
  }

  render() {
    return this.props.children;
  }
}

export { Router };