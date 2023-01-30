import { createRender } from '@new-internal/render';
import { createRootComponent, createComponentFactory } from '@new-internal/component';

import { Context } from './Context';

class Renderer {
  domContext = new Context();
  renderingComponent = false;

  constructor(BaseComponent, rootRender, anchor, services) {
    this.services = services;
    this.createComponent = createComponentFactory(BaseComponent, this.domContext, this.services);
    this.root = createRootComponent(rootRender, anchor, this.domContext);
    this.root.domContext = this.domContext;
  }

  mount(render, parent) {
    const mountedComponent = this.createComponent(render);
    mountedComponent.mount(parent);
    if (mountedComponent.componentDidMount) mountedComponent.componentDidMount();
    return mountedComponent;
  }

  render(render, parent, currentComponent) {
    const appRender = createRender(render);
    const renderedComponent = this.renderComponent(appRender, parent, currentComponent);
    this.renderingComponent = true;
    const componentRender = renderedComponent.render();
    this.renderingComponent = false;
    const { children: nextChildren } = createRender(componentRender);
    const currentChildren = (currentComponent && currentComponent.children) ? currentComponent.children : [];
    if (nextChildren.length || currentChildren.length) {
      this.renderChildren(nextChildren, currentChildren, renderedComponent);
    }
    if (renderedComponent.isElementComponent) this.domContext.removeValue();
  }

  renderChildren(nextChildren, currentChildren, currentComponent) {
    if (currentChildren.length <= nextChildren.length) {
      nextChildren.forEach((child, i) => {
        this.render(child, currentComponent, currentComponent.children[i]);
      });
    } else {
      currentChildren.forEach((child, i) => {
        if (i < nextChildren.length) {
          this.render(nextChildren[i], currentComponent, currentComponent.children[i]);
        } else {
          child.unmount();
        }
      });
    }
  }

  renderComponent(render, parent, currentComponent) {
    if (currentComponent) return this.update(render, currentComponent);
    return this.mount(render, parent);
  }

  rootRender() {
    const root = this.root;
    this.render(root.render(), root, root.firstChild);
    this.domContext.removeValue();
  }

  update(render, currentComponent) {
    if (currentComponent.canUpdate(render)) {
      currentComponent.update(render.propsObj);
      return currentComponent;
    }
    const newComponent = this.createComponent(render);
    currentComponent.parent.replaceChild(newComponent, currentComponent);
    return newComponent;
  }
}

export { Renderer };
