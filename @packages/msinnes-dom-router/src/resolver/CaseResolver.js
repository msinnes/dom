import { BaseRouteResolver } from './BaseRouteResolver';

import { RouterContext } from '../RouterContext';
import { getParams } from '../utils/path-utils';

class CaseResolver extends BaseRouteResolver {
  constructor(path, exact, render) {
    super(path, exact);

    this.render = render;
  }

  getParams(pathname) {
    return getParams(this.regex, this.path, pathname);
  }

  resolve(pathname) {
    const params = this.getParams(pathname);
    return (
      <RouterContext.Provider value={ctx => ({
        ...ctx,
        params,
      })}>
        {this.render}
      </RouterContext.Provider>
    );
  }
}

export { CaseResolver };