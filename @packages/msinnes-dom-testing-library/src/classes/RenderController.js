import { BaseServerRenderController } from '@internal/base';
import { elementEvents } from '@shared/json/elementEvents';

import { traverse } from '../fns/traverse';

class RenderController extends BaseServerRenderController {
  constructor(...args) {
    super(...args);

    this.wrapElement = this.wrapElement.bind(this);
  }

  bootstrap() {
    this.render();
  }

  processEffects(trace = 0) {
    if (trace >= 50) throw new Error('ImplementationError: Maximum call depth exceeded');
    this.scope.enable();
    this.scope.services.digestEffects();
    this.scope.disable();
    if (this.queue.length) {
      while(this.queue.length) {
        this.renderFrame();
      }
      super.render();
      this.processEffects(trace + 1);
    }
  }

  render() {
    super.render();
    this.processEffects();
    traverse(this.scope.body.elem, elem => {
      this.wrapElement(elem);
    });
  }

  wrapElement(element) {
    elementEvents.forEach(key => {
      if (element[key] && element[key] instanceof Function){
        const fn = element[key];
        element[key] = (...args) => {
          this.scope.enable();
          fn(...args);
          this.scope.disable();
          while(this.queue.length) {
            this.renderFrame();
          }
          this.render();
        };
      }
    });
  }
}

export { RenderController };
