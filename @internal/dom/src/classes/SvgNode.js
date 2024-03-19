import { isString } from '@internal/is';

import { BaseElementNode } from './BaseElementNode';
import { SvgRef } from './SvgRef';

class SvgNode extends BaseElementNode {
  create(ref) {
    return isString(ref) ? new SvgRef(ref) : ref;
  }

  update(props) {
    Object.keys(props).forEach(key => this.elem.setAttributeNS(null, key, props[key]));
  }
}

export { SvgNode };
