import { BaseBrowserRenderController } from '@new-internal/base';

class HydrateController extends BaseBrowserRenderController {
  bootstrap() {
    this.emptyElementChildren(this.renderer.root.elem.elem);
    this.render();
  }

  emptyElementChildren(elem) {
    while(elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }
  }
}

export { HydrateController };
