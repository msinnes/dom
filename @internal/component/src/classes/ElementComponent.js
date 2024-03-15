import { ElementNode } from '@internal/dom';

import { DomComponent } from './base/DomComponent';

// TODO: ElementComponent should be an abstract component in the base folder
// This should be extended by HTMLComponent and SVGComponent
// The only difference will be that they have different constructors
class ElementComponent extends DomComponent {
  isElementComponent = true;

  constructor(signature, props) {
    super(signature, props);
    // TODO: this will happen in the respective subclass constructor
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
