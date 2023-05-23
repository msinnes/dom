import { DomRef } from '@internal/dom';
import { Infra } from '@internal/infra';

import { DigestibleScope } from './base/DigestibleScope';

import { DomScope } from './dom/DomScope';
import { FetchScope } from './fetch/FetchScope';
import { InfraScope } from './dom/InfraScope';
import { TimeScope } from './time/TimeScope';

// this is found in the jsdom configuration docs.
const DEFAULT_JSDOM_URL = 'about:blank';

class SsrScope extends DigestibleScope {
  get services() {
    return this.infra.services;
  }

  get url() {
    const url = this.dom.dom.window.location.href;
    if (url === DEFAULT_JSDOM_URL) return;
    return url;
  }

  constructor(config) {
    super();
    // Wrap the fetch fn in disable scope/enable scope calls. This will allow the fetch request to process in server mode.
    const fetchConfig = {
      ...config.fetch,
      fetch: (req, res) => {
        if (!config.fetch.fetch) return;

        this.disable();
        config.fetch.fetch(req, res);
        this.enable();
      },
    };

    this.infra = new InfraScope(new Infra());
    this.time = new TimeScope(config.time);
    this.fetch = new FetchScope(fetchConfig);

    this.dom = new DomScope(config.dom, this.time, this.fetch);
    this.body = new DomRef(this.dom.dom.window.document.body);
  }

  digest() {
    return [
      ...this.time.digest(),
      ...this.fetch.digest(),
    ];
  }

  enable() {
    this.dom.enable();
    this.fetch.enable();
    this.infra.enable();
    this.time.enable();
  }

  disable() {
    this.dom.disable();
    this.fetch.disable();
    this.infra.disable();
    this.time.disable();
  }
}

export { SsrScope };
