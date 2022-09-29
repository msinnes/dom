import { abstract } from '@internal/oop/abstract';
import { abstractMethod } from '@internal/oop/abstractMethod';
import { FrameQueue } from '@internal/frame/FrameQueue';

const BaseRenderController = abstract(class {
  constructor(domRenderer, appRenderer) {
    this.queue = new FrameQueue();
    this.domRenderer = domRenderer;
    this.appRenderer = appRenderer;

    abstractMethod(this, 'render');
  }

  renderApp() {
    const appRoot = this.appRenderer.root;
    this.appRenderer.render(appRoot.render(), appRoot, appRoot.firstChild);
  }

  renderAppFrame() {
    const fr = this.queue.next();
    fr.write();
  }

  renderDom() {
    const domRender = this.appRenderer.resolve();
    const domRoot = this.domRenderer.root;
    this.domRenderer.render(domRender, domRoot, domRoot.firstChild);
  }

  renderFrame(instance, nextState) {
    if (this.appRenderer.renderingComponent)
      throw new Error('ImplementationError: setState cannot be called during the render cycle');
    this.queue.add(instance, nextState);
  }
});

export { BaseRenderController };
