import { BaseSsrRenderController } from '@internal/ssr/BaseSsrRenderController';

import { renderDomString } from './renderDomString';

class ToStringRenderController extends BaseSsrRenderController {
  render() {
    super.render();
    return renderDomString(this.domRenderer.root);
  }
}

export { ToStringRenderController };