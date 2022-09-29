import { createRouteRegex } from '../utils/createRouteRegex';

// TODO: this should resolve location, params, and other route functions
class BaseRouteResolver {
  constructor(path, exact) {
    this.regex = createRouteRegex(path, exact);
  }

  test(route) {
    return this.regex.test(route);
  }
}

export { BaseRouteResolver };