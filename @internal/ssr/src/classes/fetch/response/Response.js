import { SyncPromise } from '../../base/SyncPromise';

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

export { Response };
