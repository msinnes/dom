import { abstract } from '@internal/oop/abstract';
import { abstractMethod } from '@internal/oop/abstractMethod';

const selfClosingTags = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];

const createElement = (tag, attrs = '', children = '') => {
  if (selfClosingTags.indexOf(tag) >= 0) return new VoidElement(tag, attrs);
  return new NormalElement(tag, attrs, children);
};

const BaseElement = abstract(class {
  constructor(tag, attrs) {
    this.tag = tag;
    this.attrs = attrs;
  }

  stringify() {
    return `<${this.tag}${this.attrs}`;
  }
});

class NormalElement extends BaseElement {
  constructor(tag, attrs, children) {
    super(tag, attrs);
    this.children = children;
  }

  stringify() {
    return `${super.stringify()}>${this.children}</${this.tag}>`;
  }
}

class VoidElement extends BaseElement {
  stringify() {
    return `${super.stringify()} />`;
  }
}

export { createElement, BaseElement, NormalElement, VoidElement };