import { CompositeResponse } from '../response/CompositeResponse';

class Request {
  resolved = false;

  constructor(url, config = {}, resolve, doRequest) {
    this.url = url;
    this.config = config;
    this.resolve = resolve;
    this.doRequest = doRequest;
  }

  exec() {
    const req = { url: this.url, config: this.config };
    const res = new CompositeResponse(this.doRequest.bind(this), this.resolve.bind(this));
    res.executeRequest(req);
  }
}

export { Request };
