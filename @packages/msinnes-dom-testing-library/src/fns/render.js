import { parseConfig, SsrScope } from '@internal/ssr';

import { RenderController } from '../classes/RenderController';
import { AppRef } from '../classes/AppRef';
import { Screen } from '../classes/Screen';

// TODO: RenderController, SsrScope, and parseConfig should all come from @internal/ssr
const renderFn = (render, userConfig) => {
  const config = parseConfig(userConfig);
  const scope = new SsrScope(config, AppRef);
  const ctrl = new RenderController(render, scope);
  ctrl.render();
  return new Screen(ctrl);
};

export { parseConfig, renderFn as render };
