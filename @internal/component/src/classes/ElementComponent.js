import { ElementNode } from '@internal/dom';

import { DomComponent } from './base/DomComponent';

class ElementComponent extends DomComponent {
  isElementComponent = true;

  constructor(signature, props) {
    super(signature, props);
    this.elem = new ElementNode(signature);
  }

  render() {
    super.render();
    const { children = [], ...renderProps } = this.props;
    this.elem.update(renderProps);
    return { signature: this.signature, props: renderProps, children };
  }
}

export { ElementComponent };
