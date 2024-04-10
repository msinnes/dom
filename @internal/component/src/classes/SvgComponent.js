import { SvgNode } from '@internal/dom';

import { BaseElementComponent } from './base/BaseElementComponent';

const svgXmlns = 'http://www.w3.org/2000/svg';

class SvgComponent extends BaseElementComponent {
  isSvgComponent = true;

  constructor(signature, props) {
    super(signature, props);

    this.elem = new SvgNode(signature, props.xmlns || svgXmlns);
  }
}

export { SvgComponent };
