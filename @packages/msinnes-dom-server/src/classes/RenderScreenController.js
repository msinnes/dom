import { BaseServerRenderController } from '@internal/base';

import { Screen } from './Screen';

// TODO: extend this class into an AsyncRenderScreenController
class RenderScreenController extends BaseServerRenderController {
  get domString() {
    return this.renderer.root.elem.elem.innerHTML;
  }

  get screen() {
    return new Screen({
      html: this.domString,
      url: this.scope.url,
    });
  }

  bootstrap() {
    this.render();
  }
}

export { RenderScreenController };
