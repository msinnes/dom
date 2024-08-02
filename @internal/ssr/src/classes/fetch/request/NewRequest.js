import { SyncPromise } from '../../base/SyncPromise';

class RequestContext {
  isDataSet = false;

  constructor(doRequest, resolve, reject) {
    let data;

    this.close = function() {
      resolve(this);
    };

    this.error = function(error) {
      reject(error);
    };

    this.executeRequest = function(req, res) {
      doRequest(req, res);
    };

    this.getData = function() {
      return data;
    };

    this.setData = function(value) {
      data = value;
      this.isDataSet = true;
    };
  }
}

class FetchRequest {
  constructor(url, config) {
    this.url = url;
    this.config = config;
  }
}

class FetchResponse {
  constructor(ctx) {
    this.close = function() {
      ctx.close();
    };

    this.json = function(value) {
      if (ctx.isDataSet) throw new Error('ImplementationError: Data can only be set once on a response.');
      ctx.setData(value);
    };

    this.text = function(value) {
      if (ctx.isDataSet) throw new Error('ImplementationError: Data can only be set once on a response.');
      ctx.setData(value);
    };
  }
}

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

class Response {
  constructor(ctx) {
    this.json = () => new SyncPromise(resolve => {
      resolve(ctx.getData());
    });

    this.text = () => new SyncPromise(resolve => {
      resolve(ctx.getData());
    });
  }
}

export { FetchRequest, FetchResponse, Request, Response, RequestContext };
