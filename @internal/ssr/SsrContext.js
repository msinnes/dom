import { DomContext } from './DomContext';
import { InfraContext } from './InfraContext';

class SsrContext {
  constructor() {
    this.dom = new DomContext();
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