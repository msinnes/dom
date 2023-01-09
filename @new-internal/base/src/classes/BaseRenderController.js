import { abstract, abstractMethod } from '@new-internal/oop';

import { Renderer } from './Renderer';
import { FrameQueue } from './Frame';

const BaseRenderableComponent = abstract(class {
  constructor() {
    abstractMethod(this, 'render');
  }
});

const BaseRenderController = abstract(class {
  constructor(Component, render, anchor) {
    this.renderer = new Renderer(Component, render, anchor);
    this.queue = new FrameQueue();
  }

  pushFrame(instance, nextState) {
    if (this.renderer.renderingComponent)
      throw new Error('ImplementationError: setState cannot be called during the render cycle');
    this.queue.add(instance, nextState);
  }

  render() {
    const root = this.renderer.root;
    this.renderer.render(root.render(), root, root.firstChild);
  }

  renderFrame() {
    const fr = this.queue.next();
    fr.write();
  }
});

export { BaseRenderController, BaseRenderableComponent };
