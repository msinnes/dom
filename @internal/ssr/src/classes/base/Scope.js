import { abstract, abstractMethod } from '@internal/oop';

const Scope = abstract(class {
  constructor() {
    abstractMethod(this, 'enable');
    abstractMethod(this, 'disable');
  }
});

export { Scope };
