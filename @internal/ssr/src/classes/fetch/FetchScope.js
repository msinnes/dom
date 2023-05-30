import { isDefined } from '@internal/is';
import { DigestibleScope } from '../base/DigestibleScope';
import { SyncPromise } from '../base/SyncPromise';

import { Requests } from './request/Requests';

class FetchScope extends DigestibleScope {
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
      this.requests.create(url, config, resolve, this.doRequest);
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
