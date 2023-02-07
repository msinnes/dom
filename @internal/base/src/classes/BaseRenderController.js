import { abstract, abstractMethod } from '@internal/oop';

import { Renderer } from './Renderer';
import { FrameQueue } from './Frame';

const BaseRenderableComponent = abstract(class {
  constructor(props) {
    this.props = props;
    abstractMethod(this, 'render');
  }
});

const BaseRenderController = abstract(class {
  constructor(render, anchor, services) {
    this.queue = new FrameQueue();
    this.services = {
      pushFrame: this.pushFrame.bind(this),
      ...services,
    };
    this.renderer = new Renderer(BaseRenderableComponent, render, anchor, this.services);
  }

  pushFrame(instance, nextState) {
    if (this.renderer.renderingComponent)
      throw new Error('ImplementationError: setState cannot be called during the render cycle');
    this.queue.add(instance, nextState);
  }

  render() {
    this.renderer.rootRender();
  }

  renderFrame() {
    const fr = this.queue.next();
    fr.write();
  }

  unmount() {
    this.renderer.root.unmount();
  }
});

export { BaseRenderController, BaseRenderableComponent };
