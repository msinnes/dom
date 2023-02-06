import * as DOM from '@new-msinnes/dom';
import { RouterContext } from '../RouterContext';

import { BaseRoute } from './BaseRoute';

class CaseResolver extends BaseRoute {
  constructor(path, exact, render) {
    super(path, exact);

    this.render = render;
  }

  resolve(pathname) {
    const params = this.getParams(pathname);
    return DOM.createElement(RouterContext.Provider, { value: ctx => ({ ...ctx, params }) }, [this.render]);
  }
}

export { CaseResolver };
