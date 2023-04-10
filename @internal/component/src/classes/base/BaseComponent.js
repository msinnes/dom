import { abstract, abstractMethod } from '@internal/oop';

const BaseComponent = abstract(class {
  isDomComponent = false;
  isJSXComponent = false;

  isArrayComponent = false;
  isClassComponent = false;
  isElementComponent = false;
  isEmptyComponent = false;
  isFunctionComponent = false;
  isRootComponent = false;
  isTextComponent = false;

  parent = null;
  children = [];

  get firstChild() {
    return this.children[0];
  }

  get domParent() {
    return this.domContext.value;
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
    if (this.isDomComponent) this.domParent.insertChild(this.elem);
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
    if (newChild.isDomComponent && oldChild.isDomComponent) this.domParent.replaceChild(newChild.elem, oldChild.elem);
    else if (newChild.isDomComponent && !oldChild.isDomComponent) this.domParent.insertChild(newChild.elem);
    else if (oldChild.isDomComponent && !newChild.isDomComponent) this.domParent.removeChild(oldChild.elem);
  }

  unmount() {
    if (this.children.length) this.unmountChildren();
    if (this.parent) this.parent.removeChild(this);
    if (this.isDomComponent && this.domParent) this.domParent.removeChild(this.elem);
  }

  unmountChildren() {
    let i = this.children.length;
    while(i--) {
      const child = this.children.pop();
      if (child.componentWillUnmount) child.componentWillUnmount();
      child.unmount();
    }
  }
});

export { BaseComponent };
