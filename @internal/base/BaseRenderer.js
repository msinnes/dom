import { abstract } from '@internal/oop/abstract';
import { abstractMethod } from '@internal/oop/abstractMethod';

const BaseRenderer = abstract(class {
  constructor(render = {}, services, renderFrame) {
    abstractMethod(this, 'create');
    abstractMethod(this, 'render');

    this.services = services;
    this.renderFrame = renderFrame;
    this.root = this.create(render);
  }

  mount(render, parent) {
    const mountableComponent = this.create(render);
    mountableComponent.mount(parent);
    if (mountableComponent.componentDidMount) mountableComponent.componentDidMount();
    return mountableComponent;
  }

  renderChildren(nextChildren, currentChildren, currentComponent) {
    if (currentChildren.length <= nextChildren.length) {
      return nextChildren.map((child, i) => {
        return this.render(child, currentComponent, currentComponent.children[i]);
      });
    }

    return currentChildren.reduce((acc, child, i) => {
      if (i < nextChildren.length) {
        acc.push(this.render(nextChildren[i], currentComponent, currentComponent.children[i]));
      } else {
        if (child.componentWillUnmount) child.componentWillUnmount();
        if (child.destroyEffect) child.destroyEffect();
        child.unmount();
      }
      return acc;
    }, []);
  }

  renderComponent(render, parent, currentComponent) {
    if (currentComponent) {
      return this.update(render, currentComponent);
    }
    return this.mount(render, parent);
  }

  update(render, currentComponent) {
    if (currentComponent.canUpdate(render)) {
      const propObj = (render.isJSXRender) ? render.render.props : render.render;
      currentComponent.update(propObj);
      if (currentComponent.componentDidUpdate) currentComponent.componentDidUpdate();
      return currentComponent;
    }
    const newComponent = this.create(render);
    if (currentComponent.componentWillUnmount) currentComponent.componentWillUnmount();
    if (currentComponent.destroyEffect) currentComponent.destroyEffect();
    currentComponent.parent.replaceChild(newComponent, currentComponent);
    if (newComponent.componentDidMount) newComponent.componentDidMount();
    return newComponent;
  }
});

export { BaseRenderer };
