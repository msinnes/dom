import { isDefined } from '@internal/is';
import { DigestibleScope } from '../base/DigestibleScope';
import { SyncPromise } from '../base/SyncPromise';

class FetchScope extends DigestibleScope {
  digestFetch = true;
  requests = new Requests();

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

class FetchResponse {}

class Response {}

class CompositeResponse {
  constructor() {
    this.fetch = new FetchResponse();
    this.response = new Response();

    let data;
    let hasSet = false;

    // json
    this.fetch.json = input => {
      if (hasSet) throw new Error('ImplementationError: Data can only be set once on a response.');
      data = input;
      hasSet = true;
    };

    this.response.json = () => {
      return new SyncPromise(resolve => {
        resolve(data);
      });
    };

    // text
    this.fetch.text = input => {
      if (hasSet) throw new Error('ImplementationError: Data can only be set once on a response.');
      data = input;
      hasSet = true;
    };

    this.response.text = () => {
      return new SyncPromise(resolve => {
        resolve(data);
      });
    };

    // this.resolve = () => resolvePromise(data);
  }
}

class Request {
  constructor(url, config = {}, resolve, doRequest) {
    this.url = url;
    this.config = config;
    this.resolve = resolve;
    this.doRequest = doRequest;
  }

  exec() {
    const req = { url: this.url, config: this.config };
    const res = new CompositeResponse();
    this.doRequest(req, res.fetch);
    this.resolve(res.response);
  }
}

class Requests {
  requests = [];

  create(url, config, resolve, doRequest) {
    this.requests.push(new Request(url, config, resolve, doRequest));
  }

  getAll() {
    const all = [...this.requests];
    this.requests = [];
    return all;
  }

  getNext() {
    const next = this.requests[0];
    this.requests = this.requests.slice(1);
    return next;
  }
}

export { FetchScope, CompositeResponse, FetchResponse, Response, Request, Requests };
