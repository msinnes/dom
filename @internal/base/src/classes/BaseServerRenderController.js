import { abstract } from '@internal/oop';

import { BaseRenderController } from './BaseRenderController';

const BaseServerRenderController = abstract(class extends BaseRenderController {
  constructor(render, ssrScope) {
    super(render, ssrScope.body, ssrScope.services);

    this.scope = ssrScope;
  }

  processEffects(trace = 0) {
    if (trace >= 50) throw new Error('ImplementationError: Maximum call depth exceeded');
    this.scope.services.digestEffects();
    if (this.queue.length) {
      while(this.queue.length) {
        this.renderFrame();
      }
      super.render();
      this.processEffects(trace + 1);
    }
  }

  render() {
    this.scope.enable();
    super.render();
    this.processEffects();
    this.scope.disable();
  }
});

export { BaseServerRenderController };
