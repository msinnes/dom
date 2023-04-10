import { isString } from '@internal/is';

class DomRef {
  constructor(ref) {
    this.elem = isString(ref) ? document.createElement(ref) : ref;
  }
}

export { DomRef };
