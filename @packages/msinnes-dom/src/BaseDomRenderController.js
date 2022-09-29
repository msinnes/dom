import { abstract } from '@internal/oop/abstract';
import { extendz } from '@internal/oop/extendz';
import createElement from '@internal/utils/createElement';
import { BaseRenderController } from '@internal/base/BaseRenderController';
import { BaseAppRenderer, RenderableComponent } from '@internal/app/AppRenderer';
import { ClassComponent } from '@internal/app/components/ClassComponent';
import { AppRender } from '@internal/app/AppRender';
import { DomRenderer } from '@internal/dom/DomRenderer';
import { DomRef } from '@internal/dom/DomRef';

import { services } from './infra';

class AppRenderer extends BaseAppRenderer {
  create(render) {
    const appRender = render instanceof AppRender ? render : new AppRender(render);
    const { signature, props } = appRender.render || {};
    if (extendz(signature, RenderableComponent)) return new ClassComponent(signature, props, this.composedServices);
    return super.create(appRender);
  }
}

const BaseDomRenderController = abstract(class extends BaseRenderController {
  renderTimeoutId = null;

  constructor(render, anchor) {
    super(
      new DomRenderer(createElement(new DomRef(anchor))),
      new AppRenderer(createElement(() => render, {}), services)
    );
    this.appRenderer.renderFrame = this.renderFrame.bind(this);
  }

  render() {
    if (this.queue.length) {
      this.renderAppFrame();
    } else {
      this.renderApp();
      this.renderDom();
    }
  }

  renderAppFrame() {
    super.renderAppFrame();
    this.renderAsync();
  }

  renderAsync() {
    setTimeout(() => this.render());
  }

  renderDom() {
    super.renderDom();
    services.digestEffects();
  }

  renderFrame(instance, nextState) {
    super.renderFrame(instance, nextState);
    if (this.renderTimeoutId) clearInterval(this.renderTimeoutId);
    this.renderTimeoutId = setTimeout(() => {
      this.renderTimeoutId = null;
      this.render();
    });
  }
});

export { BaseDomRenderController };
