import { FetchResponse } from '../response/FetchResponse';
import { FetchRequest } from './FetchRequest';

class Request {
  constructor(url, config, ctx) {
    this.fetchRequest = new FetchRequest(url, config);
    this.fetchResponse = new FetchResponse(ctx);
    this.ctx = ctx;
  }

  exec() {
    this.ctx.executeRequest(this.fetchRequest, this.fetchResponse);
  }
}

export { Request };
