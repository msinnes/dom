import { SyncPromise } from '../../base/SyncPromise';

class Response {
  constructor(ctx) {
    this.json = () => new SyncPromise(resolve => {
      resolve(ctx.getData());
    });

    this.text = () => new SyncPromise(resolve => {
      resolve(ctx.getData());
    });

    Object.defineProperty(this, 'ok', {
      get: () => ctx.ok,
    });
  }
}

export { Response };
