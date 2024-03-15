import { isString } from '@internal/is';

import { BaseDomNode } from './BaseDomNode';
import { DomRef } from './DomRef';

// TODO: this will be in the HTMLNode
const createElement = ref => isString(ref) ? new DomRef(ref) : ref;

// TODO: This should be an abstract class that is extended by HTMLElementNode and SVGElementNode
class ElementNode extends BaseDomNode {
  constructor(ref) {
    super();
    // TODO: this will happen in the respective subclass
    this.ref = createElement(ref);
    this.tag = this.elem.tagName.toLowerCase();
  }

  // TODO: This will happen in the respective subclass
  update({ list, style, ...rest }) {
    if (list) this.elem.setAttribute('list', list);
    if (style) Object.assign(this.elem.style, style);
    Object.assign(this.elem, rest);
  }
}

export { ElementNode };
