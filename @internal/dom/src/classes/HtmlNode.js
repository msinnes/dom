import { isString } from '@internal/is';

import { BaseElementNode } from './BaseElementNode';
import { DomRef } from './DomRef';

class HtmlNode extends BaseElementNode {
  create(ref) {
    return isString(ref) ? new DomRef(ref) : ref;
  }

  updateProps(props) {
    const { list, ...rest } = props;
    if (list && list !== this.elem.getAttribute('list')) this.elem.setAttribute('list', list);

    Object.keys(rest).forEach(key => {
      const data = rest[key];
      if (this.elem[key] !== data) {
        this.elem[key] = data;
      }
    });

    const keys = Object.keys(props);
    Object.keys(this.lastProps).forEach(key => {
      if (!keys.includes(key)) {
        key === 'list' ? this.elem.removeAttribute(key) : this.elem[key] = null;
      }
    });

    this.lastProps = props;
  }
}

export { HtmlNode };
