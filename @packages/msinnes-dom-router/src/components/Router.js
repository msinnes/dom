import { Component } from '@msinnes/dom';
import { RouterContext } from '../RouterContext';
import { createBaseRouteRegex } from '../utils/regex-utils';
import { getParams } from '../utils/path-utils';

class Router extends Component {
  constructor(props) {
    super(props);

    this.state = 0;

    if (props.basePath) {
      this.path = props.basePath;
      this.regex = createBaseRouteRegex(props.basePath);
    }
    this.onPopstate = this.onPopstate.bind(this);
    this.navigate = this.navigate.bind(this);
  }

  componentDidMount() {
    window.addEventListener('popstate', this.onPopstate);
  }

  navigate(to) {
    let destination, state;
    if (typeof to === 'string') {
      destination = to;
      state = {};
    } else {
      destination = to.pathname;
      state = to.state;
    }
    window.history.pushState(state, null, window.location.origin + destination);
    window.dispatchEvent(new PopStateEvent('popstate', { state }));
  }

  onPopstate() {
    this.setState(state => ++state);
  }

  render() {
    let params = {};
    if (this.regex) params = getParams(this.regex, this.path, window.location.pathname);

    return (
      <RouterContext.Provider value={{
          navigate: this.navigate,
          basePath: this.regex,
          location: window.location,
          params,
        }}>
        {this.props.children}
      </RouterContext.Provider>
    );
  }
}

export { Router };