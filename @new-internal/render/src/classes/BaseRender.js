import { abstract } from '@new-internal/oop';

const BaseRender = abstract(class {
  isTextRender = false;
  isArrayRender = false;
  isEmptyRender = false;
  isJSXRender = false;
  isElementRender = false;

  get signature() {
    if (this.isJSXRender) return this.render.signature;
  }

  get props() {
    if (this.isJSXRender) return { ...this.render.props, children: this.render.children };
    return {};
  }

  get children() {
    if (this.isElementRender) return this.render.children;
    if (this.isJSXRender) return [this.render];
    if (this.isArrayRender) return this.render;
    return [];
  }

  get propsObj() {
    if (this.isJSXRender) return this.props;
    return this.render;
  }

  constructor(render) {
    this.render = render;
  }
});

export { BaseRender };