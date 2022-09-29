import { BaseRenderer } from '@internal/base/BaseRenderer';
import { abstract } from '@internal/oop/abstract';
import { abstractMethod } from '@internal/oop/abstractMethod';
import { extendz } from '@internal/oop/extendz';

import { AppRender } from './AppRender';
import { ArrayComponent } from './components/ArrayComponent';
import { ElementComponent } from './components/ElementComponent';
import { EmptyComponent } from './components/EmptyComponent';
import { FunctionComponent } from './components/FunctionComponent';
import { TextComponent } from './components/TextComponent';

const AbstractRenderableComponent = abstract(class RenderableComponent {
  constructor(props) {
    abstractMethod(this, 'render');
    this.props = props || {};
  }
});

const BaseAppRenderer = abstract(class extends BaseRenderer {
  renderingComponent = false;

  get composedServices() {
    return {
      ...this.services,
      renderFrame: this.renderFrame,
    };
  }

  constructor(render, services, renderFrame) {
    super(render, services, renderFrame);
  }

  create(render) {
    const { isArrayRender, isStringRender, isEmptyRender, render: _render } = render;
    if (isArrayRender) return new ArrayComponent(_render);
    if (isStringRender) return new TextComponent(_render);
    if (isEmptyRender) return new EmptyComponent();
    const { signature, props } = _render;
    if (signature instanceof Function) return new FunctionComponent(signature, props, this.composedServices);
    return new ElementComponent(signature, props);
  }

  render(render, parent, currentComponent) {
    const appRender = new AppRender(render);
    const renderedComponent = this.renderComponent(appRender.getRenderableRender(), parent, currentComponent);
    const currentChildren = (currentComponent && currentComponent.children) ? currentComponent.children : [];
    this.renderingComponent = true;
    const componentRender = renderedComponent.render();
    this.renderingComponent = false;
    const renderedAppRender = new AppRender(componentRender);
    const nextChildren = renderedComponent.getNextChildren(renderedAppRender);
    let renderedChildren = [];
    if (nextChildren.length || currentChildren.length) {
      this.renderChildren(nextChildren, currentChildren, renderedComponent);
    }
    this.services.clearContextValue(renderedComponent.signature);
  }

  resolve() {
    return this.root.resolve();
  }
});

export { BaseAppRenderer, AbstractRenderableComponent as RenderableComponent };
