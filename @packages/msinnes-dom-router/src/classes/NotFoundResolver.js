import { BaseRoute } from '@internal/routes';

class NotFoundResolver extends BaseRoute {
  constructor() {
    super('*', false);
  }

  resolve() {
    throw new Error('404 Not Found');
  }
}

export { NotFoundResolver };
