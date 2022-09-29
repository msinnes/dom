import { InteractiveComponent } from './abstract/InteractiveComponent';

class FunctionComponent extends InteractiveComponent {
  constructor(inputFn, props, services) {
    super(inputFn, props);
    this.fn = inputFn;
    this.state = 0;
    this.setState = () => services.renderFrame(this);
    services.createEffectContext(this);
    services.createHookContext(this);

    this.closeHooks = function() {
      services.closeActiveHookContext();
    };

    this.componentWillUnmount = function() {
      services.destroyHookContext(this);
    };

    this.destroyEffect = function() {
      services.destroyEffectContext(this);
    };

    this.openHooks = function() {
      services.setActiveHookContext(this);
    };
  }

  render() {
    this.openHooks();
    const result = this.fn(this.props);
    this.closeHooks();
    return result;
  }

  update(props = {}) {
    this.props = props;
  }

  writeState() {
    this.state++;
  }
}

export { FunctionComponent };