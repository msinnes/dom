import { DomRef } from './DomRef';
import { BaseDomNode } from './BaseDomNode';

class RootNode extends BaseDomNode {
  constructor(anchor) {
    super();
    this.ref = anchor;
  }
}

export { RootNode };
