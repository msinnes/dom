import { SyncPromise } from '../../base/SyncPromise';

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

export { Response };
