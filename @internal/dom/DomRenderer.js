import { BaseRenderer } from '@internal/base/BaseRenderer';

import { ArrayComponent, DomComponent, StringComponent } from './DomComponent';
import { DomRender } from './DomRender';

class DomRenderer extends BaseRenderer {
  create(render) {
    const domRender = render instanceof DomRender ? render : new DomRender(render);
    const { isArrayRender, isStringRender, render: _render } = domRender;
    if (isArrayRender) return new ArrayComponent(_render);
    if (isStringRender) return new StringComponent(_render);
    return new DomComponent(_render);
  }

  render(render, parent, currentComponent) {
    const domRender = new DomRender(render);
    let { children = [] } = domRender.render;
    if (domRender.isArrayRender) children = domRender.render;
    const renderedComponent = this.renderComponent(domRender, parent, currentComponent);
    const currentChildren = (currentComponent && currentComponent.children) ? currentComponent.children : [];
    if (children.length || currentChildren.length)
      this.renderChildren(children, currentChildren, renderedComponent);
  }
}

export { DomRenderer };
