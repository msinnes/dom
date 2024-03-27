import { BaseAppRef } from '@internal/base';

import { RenderController } from './RenderController';

import { infra } from '../infra';

class AppRef extends BaseAppRef {
  constructor(elem) {
    super(elem);

    this.create = render => new RenderController(render, this, infra.services);
  }
}

export { AppRef };
