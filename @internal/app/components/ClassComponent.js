import { InteractiveComponent } from './abstract/InteractiveComponent';

class ClassComponent extends InteractiveComponent {
  constructor(InputConstructor, props, services) {
    super(InputConstructor, props);
    const self = this;
    this.instance = new InputConstructor(props);
    this.instance.setState = (function (nextState) {
      services.renderFrame(self, nextState);
    }).bind(this.instance);

    // bind lifecycle hooks
    if (this.instance.componentDidMount)
      this.componentDidMount = this.instance.componentDidMount.bind(this.instance);
    if (this.instance.componentDidUpdate)
      this.componentDidUpdate = this.instance.componentDidUpdate.bind(this.instance);
    if (this.instance.componentWillUnmount)
      this.componentWillUnmount = this.instance.componentWillUnmount.bind(this.instance);

    // register an effect if there is one
    if (this.instance.effect) {
      services.createEffectContext(this);
      this.domEffect = services.addEffect(this, this.instance.effect);
    }

    this.checkContext = function() {
      if (this.signature.contextType)
        this.instance.context = services.getContextValue(this.signature.contextType);
    }

    this.destroyEffect = function() {
      if (this.instance.effect)
        services.destroyEffectContext(this);
    }
  }

  checkEffect() {
    if (this.domEffect && this.instance.effectConditions)
      this.domEffect.setShouldExecute(this.instance.effectConditions());
  }

  render() {
    this.checkContext();
    this.checkEffect();
    return this.instance.render();
  }

  update(props = {}) {
    this.instance.props = props;
  }

  writeState(nextState) {
    let writableState = nextState;
    if (nextState instanceof Function) writableState = nextState(this.instance.state);
    this.instance.state = writableState;
  }
}

export { ClassComponent };