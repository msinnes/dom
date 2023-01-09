import { isString } from '@new-internal/is';

import { BaseDomNode } from './BaseDomNode';
import { DomRef } from './DomRef';

const createElement = ref => isString(ref) ? new DomRef(ref) : ref;

class ElementNode extends BaseDomNode {
  constructor(ref) {
    super();
    this.ref = createElement(ref);
    this.tag = this.elem.tagName.toLowerCase();
  }
}

export { ElementNode };
