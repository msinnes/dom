import { SvgNode } from '@internal/dom';

import { BaseElementComponent } from './base/BaseElementComponent';

class SvgComponent extends BaseElementComponent {
  isSvgComponent = true;

  constructor(signature, props) {
    super(signature, props);

    this.elem = new SvgNode(signature);
  }
}

export { SvgComponent };
