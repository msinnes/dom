import { isDefined } from '@internal/is';
import { HookableScope } from '../base/HookableScope';
import { SyncPromise } from '../base/SyncPromise';

import { Requests } from './request/Requests';

class FetchScope extends HookableScope {
  digestFetch = true;
  requests = new Requests();

  get getAll() {
    return this.requests.getAll;
  }

  get getNext() {
    return this.requests.getNext;
  }

  constructor(config) {
    super();
    if (isDefined(config.digestFetch)) this.digestFetch = config.digestFetch;

    if (isDefined(config.fetch)) this.doRequest = config.fetch;
    else this.doRequest = () => undefined;
  }

  createRequest(url, config) {
    return new SyncPromise(resolve => {
      const resolveCb = data => {
        resolve(data);
        this.trigger();
      };
      this.requests.create(url, config, resolveCb, this.doRequest);
    });
  }

  digest() {
    if (this.digestFetch) return this.requests.getAll();
    return [];
  }

  disable() {
    delete global.fetch;
  }

  enable() {
    global.fetch = this.createRequest.bind(this);
  }
}

export { FetchScope };
