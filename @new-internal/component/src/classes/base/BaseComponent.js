import { abstract, abstractMethod } from '@new-internal/oop';

const BaseComponent = abstract(class {
  parent = null;
  children = [];

  get firstChild() {
    return this.children[0];
  }

  constructor() {
    abstractMethod(this, 'canUpdate');
    abstractMethod(this, 'render');
    abstractMethod(this, 'update');
  }

  appendChild(child) {
    this.children.push(child);
  }

  findChildIndex(child) {
    return this.children.indexOf(child);
  }

  mount(parent) {
    parent.appendChild(this);
    this.parent = parent;
  }

  removeChild(child) {
    const idx = this.findChildIndex(child);
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
    while(i--) {
      this.children.pop().unmount();
    }
  }
});

export { BaseComponent };