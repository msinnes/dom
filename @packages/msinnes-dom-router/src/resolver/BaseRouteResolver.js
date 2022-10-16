import { createRouteRegex } from '../utils/regex-utils';

class BaseRouteResolver {
  constructor(path, exact) {
    this.regex = createRouteRegex(path, exact);
    this.path = path;
  }

  test(route) {
    return this.regex.test(route);
  }
}

export { BaseRouteResolver };