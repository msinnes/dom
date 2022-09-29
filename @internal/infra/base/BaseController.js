import { abstract } from '@internal/oop/abstract';
import { abstractMethod } from '@internal/oop/abstractMethod';

const BaseController = abstract(class {
  instances = [];
  contexts = [];

  constructor() {
    abstractMethod(this, 'createContext');
  }

  findIdx(instance) {
    return this.instances.indexOf(instance);
  }

  lookup(instance) {
    const idx = this.findIdx(instance);
    if (idx < 0) return;
    return this.contexts[idx];
  }

  push(instance, context) {
    this.instances.push(instance);
    this.contexts.push(context);
  }
});

export { BaseController };