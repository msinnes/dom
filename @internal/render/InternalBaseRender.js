import { abstract } from '@internal/oop/abstract';

const InternalBaseRender = abstract(class {
  isStringRender = false;
  isArrayRender = false;
  isEmptyRender = false;
  isJSXRender = false;

  constructor(render) {
    this.render = render;
  }
});

export { InternalBaseRender };