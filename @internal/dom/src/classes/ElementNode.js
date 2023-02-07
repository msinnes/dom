import { isString } from '@internal/is';

import { BaseDomNode } from './BaseDomNode';
import { DomRef } from './DomRef';

const createElement = ref => isString(ref) ? new DomRef(ref) : ref;

class ElementNode extends BaseDomNode {
  constructor(ref) {
    super();
    this.ref = createElement(ref);
    this.tag = this.elem.tagName.toLowerCase();
  }

  update({ style, ...rest }) {
    Object.assign(this.elem.style, style);
    Object.assign(this.elem, rest);
  }
}

export { ElementNode };
