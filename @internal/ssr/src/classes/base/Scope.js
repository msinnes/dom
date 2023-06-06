import { abstract, abstractMethod } from '@internal/oop';

const Scope = abstract(class {
  children = [];
  open = true;

  get closed() {
    return !this.open;
  }

  constructor() {
    abstractMethod(this, 'enable');
    abstractMethod(this, 'disable');
  }

  append(name, scope) {
    this.children.push(scope);
    this[name] = scope;
  }

  close() {
    this.children.forEach(child => child.close());
    this.open = false;
  }
});

export { Scope };
