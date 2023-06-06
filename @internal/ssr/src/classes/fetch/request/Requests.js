import { Request } from './Request';

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

export { Requests };
