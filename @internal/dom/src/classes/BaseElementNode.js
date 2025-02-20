import { isString } from '@internal/is';
import { abstract, abstractMethod } from '@internal/oop';

import { BaseDomNode } from './BaseDomNode';

const BaseElementNode = abstract(class extends BaseDomNode {
  constructor(...args) {
    super();
    abstractMethod(this, 'create');
    abstractMethod(this, 'updateProps');

    this.ref = this.create(...args);
    this.tag = this.elem.tagName.toLowerCase();
  }

  setAttribute(prop, data) {
    this.elem.setAttribute(prop, data);
  }

  update({ style, ...props }) {
    this.updateStyle(style);
    this.updateProps(props);
  }

  updateStyle(style) {
    if (isString(style)) this.setAttribute('style', style);
    else Object.assign(this.elem.style, style);
  }
});

export { BaseElementNode };
