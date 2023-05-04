import { abstract } from '@internal/oop';

import { BaseRenderController } from './BaseRenderController';

const BaseServerRenderController = abstract(class extends BaseRenderController {
  constructor(render, ssrScope) {
    super(render, ssrScope.body, ssrScope.services);

    this.scope = ssrScope;
  }

  digest(trace = 0) {
    if (trace >= 50) throw new Error('ImplementationError: Maximum call depth exceeded for Asynchronous Processing.');
    const results = this.scope.digest();
    if (results.length) {
      results.forEach(this.processHandler.bind(this));
      this.digest(trace + 1);
    }
  }

  processEffects(trace = 0) {
    if (trace >= 50) throw new Error('ImplementationError: Maximum call depth exceeded for DOM Effects.');
    this.scope.services.digestEffects();
    if (this.queue.length) {
      while(this.queue.length) {
        this.renderFrame();
      }
      super.render();
      this.processEffects(trace + 1);
    }
  }

  processHandler(handler) {
    handler.exec();
    if (this.queue.length) {
      while(this.queue.length) {
        this.renderFrame();
      }
      super.render();
      this.processEffects();
    }
  }

  render() {
    this.scope.enable();
    super.render();
    this.processEffects();
    this.digest();
    this.scope.disable();
  }
});

export { BaseServerRenderController };
