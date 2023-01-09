import { abstract } from '@new-internal/oop';

const BaseDomNode = abstract(class {
  get elem() {
    return this.ref.elem;
  }
});

export { BaseDomNode };