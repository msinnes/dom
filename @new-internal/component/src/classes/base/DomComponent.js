import { abstract } from '@new-internal/oop';

import { JSXComponent } from './JSXComponent';

const DomComponent = abstract(class extends JSXComponent {
  isDomComponent = true;

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

  constructor(node) {
    this.node = node;
  }

  increment() {
    this.index++;
  }

  insertChild(child) {
    this.elem.insertBefore(child.elem, this.elem.children[this.index]);
    // this.increment();
  }

  removeChild(child) {
    this.elem.removeChild(child.elem);
  }

  replaceChild(newChild, oldChild) {
    this.elem.replaceChild(newChild.elem, oldChild.elem);
  }
}

export { DomComponent, DomParent };
