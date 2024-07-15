import { BaseAppRef } from '@internal/base';

import { RenderController } from './RenderController';

class AppRef extends BaseAppRef {
  constructor(elem, SsrScope) {
    super(elem, render => {
      const controller = new RenderController(render, SsrScope);
      controller.hook('bootstrap', () => {
        SsrScope.trigger('bootstrap', controller);
      });
      return controller;
    });
  }
}

export { AppRef };
