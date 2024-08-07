import { BaseAppRef } from '@internal/base';

import { RenderScreenController } from './RenderScreenController';

class AppRef extends BaseAppRef {
  constructor(elem, SsrScope) {
    super(elem, render => new RenderScreenController(render, SsrScope));
  }
}

export { AppRef };
