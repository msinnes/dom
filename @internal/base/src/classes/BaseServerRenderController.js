import { abstract } from '@internal/oop';

import { BaseRenderController } from './BaseRenderController';

// TODO: should just become RenderController in @internal/ssr module
const BaseServerRenderController = abstract(class extends BaseRenderController {
  constructor(render, ssrScope) {
    super(render, ssrScope.container, ssrScope.services);

    this.scope = ssrScope;
    this.scope.hook('fetchResolve', () => {
      this.render();
      this.trigger('fetchResolve');
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

  processEffects(trace = 0) {
    if (trace >= 50) throw new Error('ImplementationError: Maximum call depth exceeded for DOM Effects.');
    this.services.digestEffects();
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
    let error;
    try {
      super.render();
      this.processEffects();
      this.digest();
    } catch (e) {
      error = e;
    } finally {
      this.scope.disable();
      if (error) {
        throw error;
      }
    }
  }
});

export { BaseServerRenderController };
