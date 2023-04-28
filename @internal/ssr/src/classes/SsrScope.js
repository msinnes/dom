import { DomRef } from '@internal/dom';
import { Infra } from '@internal/infra';

import { DomScope } from './DomScope';
import { InfraScope } from './InfraScope';
import { TimeScope } from './TimeScope';

// this is found in the jsdom configuration docs.
const DEFAULT_JSDOM_URL = 'about:blank';

class SsrScope {
  get services() {
    return this.infra.services;
  }

  get url() {
    const url = this.dom.dom.window.location.href;
    if (url === DEFAULT_JSDOM_URL) return;
    return url;
  }

  constructor(config) {
    this.dom = new DomScope(config.dom);
    this.body = new DomRef(this.dom.dom.window.document.body);

    this.infra = new InfraScope(new Infra());
    this.time = new TimeScope(config.time);
  }

  digest() {
    return [
      ...this.time.digest(),
    ];
  }

  enable() {
    this.dom.enable();
    this.infra.enable();
    this.time.enable();
  }

  disable() {
    this.dom.disable();
    this.infra.disable();
    this.time.disable();
  }
}

export { SsrScope };
