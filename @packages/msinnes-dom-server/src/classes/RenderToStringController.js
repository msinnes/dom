import { BaseServerRenderController } from '@internal/base';

import { renderComponent } from '../fns/domStringBuilder';

class RenderToStringController extends BaseServerRenderController {
  get domString() {
    return renderComponent(this.renderer.root);
  }

  bootstrap() {
    this.render();
  }
}

export { RenderToStringController };
