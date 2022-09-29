import { BaseDomRenderController } from './BaseDomRenderController';

class DomHydrateController extends BaseDomRenderController {
  emptyElementChildren(elem) {
    while(elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }
  }

  hydrate() {
    this.renderApp();
    setTimeout(() => {
      this.emptyElementChildren(this.domRenderer.root.elem.ref.elem);
      this.renderDom();
    });
  }
}

export { DomHydrateController };