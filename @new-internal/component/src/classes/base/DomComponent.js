import { abstract } from '@new-internal/oop';

import { JSXComponent } from './JSXComponent';

export const isDomComponent = comp => comp instanceof DomComponent;

const DomComponent = abstract(class extends JSXComponent {
  get domParent() {
    return this.domContext.value;
  }

  mount(parent) {
    super.mount(parent);
    this.domParent.appendChild(this.elem);
  }

  render() {
    this.domContext.addValue(new DomParent(this.elem));
  }

  replaceChild(newChild, oldChild) {
    super.replaceChild(newChild, oldChild);
    if(isDomComponent(newChild) && isDomComponent(oldChild)) this.domParent.replaceChild(newChild.elem, oldChild.elem);
    else if (isDomComponent(newChild) && !isDomComponent(oldChild)) this.domParent.appendChild(newChild.elem);
    else if (isDomComponent(oldChild) && !isDomComponent(newChild)) this.domParent.removeChild(oldChild.elem);
  }

  unmount() {
    super.unmount(this.parent);
    this.domParent.removeChild(this.elem);
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

  appendChild(child) {
    this.elem.appendChild(child.elem);
  }

  increment() {
    this.index++;
  }

  removeChild(child) {
    this.elem.removeChild(child.elem);
  }

  replaceChild(newChild, oldChild) {
    this.elem.replaceChild(newChild.elem, oldChild.elem);
  }
}

export { DomComponent, DomParent };
