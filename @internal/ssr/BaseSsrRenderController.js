import { abstract } from '@internal/oop/abstract';
import { extendz } from '@internal/oop/extendz';
import { BaseRenderController } from '@internal/base/BaseRenderController';
import createElement from '@internal/utils/createElement';
import { BaseAppRenderer, RenderableComponent } from '@internal/app/AppRenderer';
import { AppRender } from '@internal/app/AppRender';
import { ClassComponent } from '@internal/app/components/ClassComponent';
import { DomRenderer } from '@internal/dom/DomRenderer';
import { DomRef } from '@internal/dom/DomRef';

class AppRenderer extends BaseAppRenderer {
  create(render) {
    const appRender = render instanceof AppRender ? render : new AppRender(render);
    const { signature, props } = appRender.render;
    if (extendz(signature, RenderableComponent)) return new ClassComponent(signature, props, this.composedServices);
    return super.create(appRender);
  }
}

const BaseSsrRenderController = abstract(class extends BaseRenderController {
  constructor(render, ctx) {
    super(
      new DomRenderer(createElement(new DomRef(ctx.dom.dom.window.document.body))),
      new AppRenderer(createElement(() => render), ctx.infra.services),
    );

    this.ctx = ctx;
    this.appRenderer.renderFrame = this.renderFrame.bind(this);
  }

  render() {
    this.ctx.enable();
    this.renderApp();
    this.renderDom();
    this.ctx.disable();
  }
});

export { BaseSsrRenderController };