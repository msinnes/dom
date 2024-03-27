import { isString } from '@internal/is';

import { BaseElementNode } from './BaseElementNode';
import { SvgRef } from './SvgRef';

const xmlns = 'http://www.w3.org/2000/svg';

class SvgNode extends BaseElementNode {
  create(ref) {
    return isString(ref) ? new SvgRef(xmlns, ref) : ref;
  }

  update(props) {
    Object.keys(props).forEach(key => this.elem.setAttributeNS(null, key, props[key]));
    if (this.tag === 'svg') this.elem.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', xmlns);
  }
}

export { SvgNode };
