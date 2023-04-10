import * as DOM from '@msinnes/dom';

import { RouterContext } from '../RouterContext';
import { BaseRoute } from '../classes/BaseRoute';

class RouterBaseRoute extends BaseRoute {}

class Router extends DOM.Component {
  constructor(props) {
    super(props);

    this.baseRoute = new RouterBaseRoute(props.basePath || '/');
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
    this.setState();
  }

  render() {
    return DOM.createElement(RouterContext.Provider, { value: {
      navigate: this.navigate,
      baseRoute: this.baseRoute,
      location: window.location,
      params: this.baseRoute.getParams(window.location.pathname),
    } }, [this.props.children]);
  }
}

export { Router };
