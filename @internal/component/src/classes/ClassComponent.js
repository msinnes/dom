import { isFunction } from '@internal/is';

import { JSXComponent } from './base/JSXComponent';

class ClassComponent extends JSXComponent {
  isClassComponent = true;

  constructor(signature, props) {
    super(signature, props);
    this.instance = new signature(props);
    props && this.update(props);
  }

  checkContext() {
    if (this.signature.contextType) this.instance.context = this.services.getContextValue(this.signature.contextType);
  }

  componentDidMount() {
    this.instance.setState = nextState => {
      this.services.pushFrame(this, nextState);
    };
    if (this.instance.componentDidMount) this.services.addClassEffect(() => this.instance.componentDidMount());
  }

  componentDidUpdate() {
    if (this.instance.componentDidUpdate) this.services.addClassEffect(() => this.instance.componentDidUpdate());
  }

  componentWillUnmount() {
    if (this.instance.componentWillUnmount) this.instance.componentWillUnmount();
  }

  render() {
    this.checkContext();
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
