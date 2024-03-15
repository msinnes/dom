import { abstract } from '@internal/oop';

import { JSXComponent } from './JSXComponent';

// TODO: isSVGComponent will be set to false here
const DomComponent = abstract(class extends JSXComponent {
  isDomComponent = true;

  // TODO: this should pass isSvgComponent to DomParent constructor
  render() {
    if (this.domParent) this.domParent.increment();
    this.domContext.addValue(new DomParent(this.elem));
  }

  unmountChildren() {
    this.domContext.addValue(new DomParent(this.elem));
    super.unmountChildren();
    this.domContext.removeValue();
  }
});

class DomParent {
  index = 0;
  get elem() {
    return this.node.elem;
  }

  // TODO: should set an isSvgNode prop based on input Boolean value
  constructor(node) {
    this.node = node;
  }

  increment() {
    this.index++;
  }

  insertChild(child) {
    this.elem.insertBefore(child.elem, this.elem.children[this.index]);
  }

  removeChild(child) {
    this.elem.removeChild(child.elem);
  }

  replaceChild(newChild, oldChild) {
    this.elem.replaceChild(newChild.elem, oldChild.elem);
  }
}

export { DomComponent, DomParent };
