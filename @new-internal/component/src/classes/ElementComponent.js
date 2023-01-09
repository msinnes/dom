import { ElementNode } from '@new-internal/dom';

import { DomComponent } from './base/DomComponent';

class ElementComponent extends DomComponent {
  constructor(signature, props) {
    super(signature, props);
    this.elem = new ElementNode(signature);
  }

  render() {
    super.render();
    const { children = [], ...renderProps } = this.props;
    return { signature: this.signature, props: renderProps, children };
  }
}

export { ElementComponent };
