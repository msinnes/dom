import { abstract } from '@internal/oop';

import { BaseRenderController } from './BaseRenderController';

const BaseBrowserRenderController = abstract(class extends BaseRenderController {
  renderTimeoutId = null;
  trace = 0;

  processEffects() {
    if (this.trace > 50) throw new Error('ImplementationError: Maximum call depth exceeded');
    this.services.digestEffects();
    if (this.queue.length) this.trace++;
    else this.trace = 0;
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
      this.processEffects();
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
