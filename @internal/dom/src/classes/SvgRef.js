import { isString } from '@internal/is';

const xmlns = 'http://www.w3.org/2000/svg';

class SvgRef {
  constructor(ref, ns = xmlns) {
    this.elem = isString(ref) ? document.createElementNS(ns, ref) : ref;
  }
}

export { SvgRef };
