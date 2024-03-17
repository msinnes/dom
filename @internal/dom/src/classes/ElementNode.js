import { isString } from '@internal/is';

import { BaseDomNode } from './BaseDomNode';
import { DomRef } from './DomRef';

// TODO: this will be in the HTMLNode - it should be an abstract method on this class
const createElement = ref => isString(ref) ? new DomRef(ref) : ref;

// TODO: Create HTMLNode and implement it
// Use all the tests from this test suite plus the create logic
class ElementNode extends BaseDomNode {
  constructor(ref) {
    super();

    // abstract classes will need to go first

    // TODO: this will happen in the respective subclass
    this.ref = createElement(ref);

    // This will be the only thing in the class
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
