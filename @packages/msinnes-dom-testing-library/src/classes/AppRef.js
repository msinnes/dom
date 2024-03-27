import { BaseAppRef } from '@internal/base';

import { RenderController } from './RenderController';

class AppRef extends BaseAppRef {
  constructor(elem, SsrScope) {
    super(elem);

    this.create = render => new RenderController(render, SsrScope);
  }
}

export { AppRef };
