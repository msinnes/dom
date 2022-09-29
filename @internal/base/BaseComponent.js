import { abstract } from '@internal/oop/abstract';
import { abstractMethod } from '@internal/oop/abstractMethod';

const BaseComponent = abstract(class {
  get firstChild () {
    return this.children[0];
  }

  constructor() {
    this.parent = null;
    this.children = [];

    abstractMethod(this, 'update');
    abstractMethod(this, 'canUpdate');
  }

  appendChild(child) {
    this.children.push(child);
  }

  findChildIndex(index) {
    return this.children.indexOf(index);
  }

  mount(parent) {
    parent.appendChild(this);
    this.parent = parent;
  }

  removeChild(index) {
    const idx = this.findChildIndex(index);
    this.children = [
      ...this.children.slice(0, idx),
      ...this.children.slice(idx + 1),
    ];
  }

  replaceChild(newChild, oldChild) {
    this.children[this.findChildIndex(oldChild)] = newChild;
    newChild.parent = this;
    oldChild.unmountChildren();
  }

  unmount() {
    if (this.children.length) this.unmountChildren();
    if (this.parent) this.parent.removeChild(this);
  }

  unmountChildren() {
    let i = this.children.length;
    while (i--) {
      this.children.pop().unmount();
    }
  }
});

export { BaseComponent };
