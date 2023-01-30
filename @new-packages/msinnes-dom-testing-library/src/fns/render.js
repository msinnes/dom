import { parseConfig, SsrScope } from '@new-internal/ssr';

import { RenderController } from '../classes/RenderController';
import { Screen } from '../classes/Screen';

const renderFn = (render, userConfig) => {
  const config = parseConfig(userConfig);
  const scope = new SsrScope(config);
  const ctrl = new RenderController(render, scope);
  ctrl.bootstrap();
  return new Screen(ctrl);
};

export { parseConfig, renderFn as render };
