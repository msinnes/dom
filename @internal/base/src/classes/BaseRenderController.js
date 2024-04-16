import { abstract } from '@internal/oop';

import { Hookable } from './Hookable';
import { Renderer } from './Renderer';
import { FrameQueue } from './Frame';

const BaseRenderableComponent = abstract(class {
  constructor(props) {
    this.props = props;
  }
});

const BaseRenderController = abstract(class extends Hookable {
  constructor(render, anchor, services) {
    super();

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
