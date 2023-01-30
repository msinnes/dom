import { abstract, abstractMethod } from '@new-internal/oop';

import { BaseRenderController } from './BaseRenderController';

const BaseBrowserRenderController = abstract(class extends BaseRenderController {
  renderTimeoutId = null;

  constructor(render, anchor, services) {
    super(render, anchor, services);

    abstractMethod(this, 'bootstrap');
  }

  pushFrame(instance, nextState) {
    super.pushFrame(instance, nextState);
    if (this.renderTimeoutId) clearInterval(this.renderTimeoutId);
    this.renderTimeoutId = this.renderAsync(true);
  }

  render() {
    if (this.queue.length) {
      this.renderFrame();
    } else {
      super.render();
    }
  }

  renderAsync(clearRenderTimeoutId = false) {
    return setTimeout(() => {
      if (clearRenderTimeoutId) this.renderTimeoutId = null;
      this.render();
    });
  }

  renderFrame() {
    super.renderFrame();
    this.renderAsync();
  }
});

export { BaseBrowserRenderController };
