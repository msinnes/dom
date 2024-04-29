import { Infra } from '@internal/infra';

import { DigestibleScope } from './base/DigestibleScope';

import { DomScope } from './dom/DomScope';
import { FetchScope } from './fetch/FetchScope';
import { InfraScope } from './dom/InfraScope';
import { TimeScope } from './time/TimeScope';

// this is found in the jsdom configuration docs.
const DEFAULT_JSDOM_URL = 'about:blank';

// TODO: requires an ssr rebuild. Needs to take the controller instance and the AppRef constructor
class SsrScope extends DigestibleScope {
  get openHandles() {
    return this.fetch.openRequests;
  }

  get services() {
    return this.infra.services;
  }

  get url() {
    const url = this.dom.dom.window.location.href;
    if (url === DEFAULT_JSDOM_URL) return;
    return url;
  }

  constructor(config, AppRef) {
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

    // Scopes for replicating a client side rendering environment
    this.append('infra', new InfraScope(new Infra(), AppRef));
    this.append('time', new TimeScope(config.time));
    this.append('fetch', new FetchScope(fetchConfig));

    // Top-level DOM scope, also maps other scopes to the document object model where necessary.
    this.append('dom', new DomScope(config.dom, this.time, this.fetch));

    // Setup for ease of use. These refs are used for rendering and queries.
    this.window = this.dom.dom.window;
    this.document = this.window.document;
    this.body = this.document.body;
    this.container = new AppRef(this.body, this);
    //Hook into fetch to trigger a rerender.
    this.fetch.hook('resolve', () => {
      this.trigger('fetchResolve');
    });
  }

  createEvent(type, config) {
    return new this.window.Event(type, config);
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
