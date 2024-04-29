import { BaseServerRenderController } from '@internal/base';
import { elementEvents } from '@shared/json/elementEvents';

import { traverse } from '../fns/traverse';

//TODO: this should all be controlled in the SsrScop. BaseServerRenderController will just become RenderController in the @internal/ssr module
class RenderController extends BaseServerRenderController {
  constructor(...args) {
    super(...args);

    this.wrapElement = this.wrapElement.bind(this);
  }

  render() {
    super.render();
    traverse(this.scope.container.elem, elem => {
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
