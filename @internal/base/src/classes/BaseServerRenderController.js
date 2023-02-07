import { abstract } from '@internal/oop';

import { BaseRenderController } from './BaseRenderController';

const BaseServerRenderController = abstract(class extends BaseRenderController {
  constructor(render, ssrScope, services) {
    super(render, ssrScope.body, ssrScope.services);

    this.scope = ssrScope;
  }

  render() {
    this.scope.enable();
    super.render();
    this.scope.disable();
  }
});

export { BaseServerRenderController };
