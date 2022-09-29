import { SignatureComponent } from './abstract/SignatureComponent';

class ElementComponent extends SignatureComponent {
  constructor(element, props) {
    super(element, props);
    this.element = element;
  }

  getNextChildren(appRender) {
    return appRender.render.children || [];
  }

  resolve() {
    const { children, ...renderProps } = this.props;
    return { signature: this.signature, props: renderProps, children: this.children.map(child => child.resolve()) };
  }

  render() {
    const { children = [], ...renderProps } = this.props;
    return { signature: this.element, props: renderProps, children };
  }

  update(props = {}) {
    this.props = props;
  }
}

export { ElementComponent };