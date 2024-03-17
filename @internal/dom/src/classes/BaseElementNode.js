import { abstract, abstractMethod } from '@internal/oop';

import { BaseDomNode } from './BaseDomNode';

const BaseElementNode = abstract(class extends BaseDomNode {
  constructor(ref) {
    super();
    abstractMethod(this, 'create');
    abstractMethod(this, 'update');

    this.ref = this.create(ref);
    this.tag = this.elem.tagName.toLowerCase();
  }
});

export { BaseElementNode };
