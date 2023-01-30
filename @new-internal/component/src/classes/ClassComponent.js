import { isFunction } from '@new-internal/is';

import { JSXComponent } from './base/JSXComponent';

class ClassComponent extends JSXComponent {
  isClassComponent = true;

  constructor(signature, props) {
    super(signature, props);
    this.instance = new signature(props);
    props && this.update(props);
  }

  componentDidMount() {
    this.instance.setState = nextState => {
      this.services.pushFrame(this, nextState);
    };
  }

  render() {
    return [this.instance.render()];
  }

  update(props) {
    super.update(props);
    this.instance.props = props;
  }

  writeState(nextState) {
    let writeableState = nextState;
    if (isFunction(nextState)) writeableState = nextState(this.instance.state);
    this.instance.state = writeableState;
  }
}

export { ClassComponent };