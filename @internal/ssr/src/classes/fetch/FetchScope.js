import { isDefined } from '@internal/is';
import { DigestibleScope } from '../base/DigestibleScope';
import { SyncPromise } from '../base/SyncPromise';

import { Requests } from './request/Requests';
import { Response } from './response/Response';
import { ResponseContext } from './response/ResponseContext';

const fetchOriginal = global.fetch;
Object.defineProperty(global, 'fetch', { writable: true });

class FetchScope extends DigestibleScope {
  digestFetch = true;
  openRequests = 0;
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
    else this.doRequest = (req, res) => res.close();
  }

  createRequest(url, config) {
    return new SyncPromise((resolve, reject) => {
      this.openRequests++;
      const resolveCb = ctx => {
        if(this.closed) return;
        resolve(new Response(ctx));
        this.openRequests--;
        this.trigger('resolve');
      };
      this.requests.create(
        url,
        config,
        new ResponseContext(this.doRequest, resolveCb, reject),
      );
    });
  }

  digest() {
    if (this.digestFetch) return this.requests.getAll();
    return [];
  }

  disable() {
    global.fetch = fetchOriginal;
  }

  enable() {
    global.fetch = this.createRequest.bind(this);
  }
}

export { FetchScope };
