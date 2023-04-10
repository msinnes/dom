import { BaseRoute } from './BaseRoute';

class RedirectResolver extends BaseRoute {
  constructor(path, exact, to) {
    super(path, exact);

    this.to = to;
  }

  resolve() {
    return this.to;
  }
}

export { RedirectResolver };
