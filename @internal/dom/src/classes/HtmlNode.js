import { isString } from '@internal/is';

import { BaseElementNode } from './BaseElementNode';
import { DomRef } from './DomRef';

class HtmlNode extends BaseElementNode {
  create(ref) {
    return isString(ref) ? new DomRef(ref) : ref;
  }

  updateProps({ list, style, ...rest }) {
    if (list) this.elem.setAttribute('list', list);
    if (style) Object.assign(this.elem.style, style);
    Object.assign(this.elem, rest);
  }
}

export { HtmlNode };
