import { JSXComponent } from './base/JSXComponent';

class FunctionComponent extends JSXComponent {
  isFunctionComponent = true;

  componentDidMount() {
    this.services.createInstanceHooks(this);
  }

  componentWillUnmount() {
    this.services.destroyInstanceHooks(this);
  }

  setState(hook, nextState) {
    this.services.pushFrame(hook, nextState);
  }

  render() {
    this.services.setActiveHookInstance(this);
    const result = [this.signature(this.props)];
    this.services.closeActiveHookInstance();
    return result;
  }
}

export { FunctionComponent };