import * as DOM from '@msinnes/dom';
import { BaseRoute } from '@internal/routes';

import { RouterContext } from '../RouterContext';


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
