import { BaseServerRenderController } from '@internal/base';

import { renderComponent } from '../fns/domStringBuilder';
import { Screen } from './Screen';

class RenderScreenController extends BaseServerRenderController {
  get domString() {
    return renderComponent(this.renderer.root);
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
