import { isString } from '@internal/is';

const xmlns = 'http://www.w3.org/2000/svg';

class SvgRef {
  constructor(ref) {
    this.elem = isString(ref) ? document.createElementNS(xmlns, ref) : ref;
  }
}

export { SvgRef };
