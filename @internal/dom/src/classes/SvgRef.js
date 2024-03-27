import { isString } from '@internal/is';

class SvgRef {
  constructor(xmlns, ref) {
    this.elem = isString(ref) ? document.createElementNS(xmlns, ref) : ref;
  }
}

export { SvgRef };
