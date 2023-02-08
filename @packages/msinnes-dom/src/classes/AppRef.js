import { DomRef } from '@internal/dom';

import { HydrateController } from './HydrateController';
import { RenderController } from './RenderController';

import { infra } from '../infra';

class AppRef extends DomRef {
  constructor(elem) {
    super(elem);

    let controller = null;
    this.hydrate = render => {
      if (controller) return this.render(render);
      controller = new HydrateController(render, this, infra.services);
      controller.bootstrap();
      return this;
    };

    this.render = render => {
      if (controller) controller.unmount();
      controller = new RenderController(render, this, infra.services);
      controller.bootstrap();
      return this;
    };

    this.unmount = () => {
      if (controller) controller.unmount();
      controller = null;
      return this;
    };
  }
}

export { AppRef };
