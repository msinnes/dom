import { isString } from '@internal/is';

import { BaseElementNode } from './BaseElementNode';
import { DomRef } from './DomRef';

class HtmlNode extends BaseElementNode {
  create(ref) {
    return isString(ref) ? new DomRef(ref) : ref;
  }

  // TODO: this should remove stale props
  updateProps({ list, ...rest }) {
    if (list && list !== this.elem.getAttribute('list')) this.elem.setAttribute('list', list);
    Object.keys(rest).forEach(key => {
      const data = rest[key];
      if (this.elem[key] !== data) {
        this.elem[key] = data;
      }
    });
  }
}

export { HtmlNode };
