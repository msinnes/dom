import { BaseDomNode } from './BaseDomNode';

import { TextRef } from './TextRef';

class TextNode extends BaseDomNode {
  constructor(text) {
    super();
    this.ref = new TextRef(text);
  }

  update(text) {
    this.elem.textContent = text;
  }
}

export { TextNode };
