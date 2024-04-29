import { abstract, abstractMethod } from '@internal/oop';

import { BaseHookable } from '@internal/base';

const Scope = abstract(class extends BaseHookable {
  children = [];
  open = true;

  get closed() {
    return !this.open;
  }

  constructor() {
    super();

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
