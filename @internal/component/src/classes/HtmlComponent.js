import { HtmlNode } from '@internal/dom';

import { BaseElementComponent } from './base/BaseElementComponent';

class HtmlComponent extends BaseElementComponent {
  constructor(signature, props) {
    super(signature, props);

    this.elem = new HtmlNode(signature);
  }
}

export { HtmlComponent };
