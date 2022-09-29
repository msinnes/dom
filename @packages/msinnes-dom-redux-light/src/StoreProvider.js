import * as Dom from '@msinnes/dom';

import { storeContext } from './storeContext';

const Provider = storeContext.Provider;

class StoreProvider extends Dom.Component {
  constructor(props) {
    super(props);

    this.appStore = props.store;

    this.state = 0;
    this.storeSubscription = this.storeSubscription.bind(this);
  }

  componentDidMount() {
    this.appStore.subscribe(this.storeSubscription);
  }

  storeSubscription() {
    this.setState(state => ++state);
  }

  render() {
    return (
      <Provider value={this.appStore}>
        {this.props.children}
      </Provider>
    );
  }
}

export { StoreProvider };