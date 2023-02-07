import { abstract, abstractMethod } from '@internal/oop';

const BaseService = abstract(class {
  entities = [];
  indexes = [];

  constructor() {
    abstractMethod(this, 'createEntity');
  }

  findIdx(index) {
    return this.indexes.indexOf(index);
  }

  lookup(index) {
    const idx = this.findIdx(index);
    if (idx < 0) return;
    return this.entities[idx];
  }

  push(index, entity) {
    this.indexes.push(index);
    this.entities.push(entity);
  }
});

export { BaseService };
