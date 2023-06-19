import { abstract } from '@internal/oop';

import { utils } from '../regexp';

const { createRouteRegex, getParams } = utils;

const BaseRoute = abstract(class {
  constructor(path, exact){
    this.regex = createRouteRegex(path, exact);
    this.path = path;
  }

  getParams(pathname) {
    return getParams(this.regex, this.path, pathname);
  }

  test(pathname) {
    return this.regex.test(pathname);
  }
});

export { BaseRoute };
