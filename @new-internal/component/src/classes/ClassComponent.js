import { JSXComponent } from './base/JSXComponent';

class ClassComponent extends JSXComponent {
  constructor(signature, props) {
    super(signature, props);
    this.instance = new signature(props);
    props && this.update(props);
  }

  render() {
    return [this.instance.render()];
  }

  update(props) {
    super.update(props);
    this.instance.props = props;
  }
}

export { ClassComponent };