import { DomContext } from './DomContext';
import { InfraContext } from './InfraContext';

class SsrContext {
  constructor(config = {}) {
    this.dom = new DomContext(config.dom);
    this.infra = new InfraContext();
  }

  enable() {
    this.dom.enable();
    this.infra.enable();
  }

  disable() {
    this.dom.disable();
    this.infra.disable();
  }
}

export { SsrContext };