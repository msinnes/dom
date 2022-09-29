import { BaseRouteResolver } from './BaseRouteResolver';

class CaseResolver extends BaseRouteResolver {
  constructor(path, exact, render) {
    super(path, exact);

    this.render = render;
  }

  resolve() {
    return this.render;
  }
}

export { CaseResolver };