import { abstract } from '@internal/oop';

import { BaseRenderController } from './BaseRenderController';

// TODO: during reorganization, this should be abstracted with hookable in scopes.
const BaseServerRenderController = abstract(class extends BaseRenderController {
  hooks = [];

  constructor(render, ssrScope) {
    super(render, ssrScope.body, ssrScope.services);

    this.scope = ssrScope;
    this.scope.hook(() => {
      this.render();
      this.trigger();
    });

    this.processHandlerBound = this.processHandler.bind(this);
  }

  close() {
    this.scope.close();
  }

  digest(trace = 0) {
    if (trace >= 50) throw new Error('ImplementationError: Maximum call depth exceeded for Asynchronous Processing.');
    const results = this.scope.digest();
    if (results.length) {
      results.forEach(this.processHandlerBound);
      this.digest(trace + 1);
    }
  }

  hook(fn) {
    this.hooks.push(fn);
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

  trigger() {
    this.hooks.forEach(hook => hook());
  }
});

export { BaseServerRenderController };
