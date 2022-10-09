import { BaseRouteResolver } from './BaseRouteResolver';

class RedirectResolver extends BaseRouteResolver {
  constructor(path, exact, to) {
    super(path, exact);

    this.to = to;
  }

  resolve() {
    return this.to;
  }
}

export { RedirectResolver };