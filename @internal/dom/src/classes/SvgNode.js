import { isString } from '@internal/is';

import { BaseElementNode } from './BaseElementNode';
import { SvgRef } from './SvgRef';

const xmlnsNs = 'http://www.w3.org/2000/xmlns/';
const xmlnsAttr = 'xmlns';
const reg = new RegExp('[\'"]', 'g');

class SvgNode extends BaseElementNode {
  create(ref, xmlns) {
    return isString(ref) ? new SvgRef(xmlns, ref) : ref;
  }

  setXMLNS(ns) {
    this.elem.setAttributeNS(xmlnsNs, xmlnsAttr, ns);
  }

  updateProps({ xmlns, ...props }) {
    if (xmlns && this.elem.getAttributeNS(xmlnsNs, xmlnsAttr) !== xmlns) this.setXMLNS(xmlns);
    Object.keys(props).forEach(key => {
      const data = props[key];
      if (this.elem.getAttributeNS(null, key) !== data) {
        this.elem.setAttributeNS(null, key.replace(reg, ''), props[key]);
      }
    });

    const keys = Object.keys(props);
    Object.keys(this.lastProps).forEach(key => {
      if (!keys.includes(key)) {
        this.elem.removeAttributeNS(null, key);
      }
    });
    this.lastProps = props;
  }
}

export { SvgNode };
