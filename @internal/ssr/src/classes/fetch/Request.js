import { CompositeResponse } from './Response';

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

  constructor() {
    this.getAll = this.getAll.bind(this);
    this.getNext = this.getNext.bind(this);
  }

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

export { Request, Requests };
