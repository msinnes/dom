import { SyncPromise } from '../base/SyncPromise';

class CompositeResponse {
  constructor() {
    let data;
    this.fetch = new FetchResponse(value => {
      data = value;
    });
    this.response = new Response(() => {
      return data;
    });
  }
}

class FetchResponse {
  hasSet = false;

  constructor(setter) {
    this.json = value => {
      if (this.hasSet) throw new Error('ImplementationError: Data can only be set once on a response.');
      setter(value);
      this.hasSet = true;
    };

    this.text = value => {
      if (this.hasSet) throw new Error('ImplementationError: Data can only be set once on a response.');
      setter(value);
      this.hasSet = true;
    };
  }
}

class Response {
  constructor(getter) {
    this.json = () => new SyncPromise(resolve => {
      resolve(getter());
    });

    this.text = () => new SyncPromise(resolve => {
      resolve(getter());
    });
  }
}

export { CompositeResponse, FetchResponse, Response };
