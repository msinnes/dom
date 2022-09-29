import { BaseDomRenderController } from './BaseDomRenderController';

class DomBootstrapController extends BaseDomRenderController {
  bootstrap() {
    this.renderApp();
    setTimeout(()  => {
      this.renderDom();
    });
  }
}

export { DomBootstrapController };