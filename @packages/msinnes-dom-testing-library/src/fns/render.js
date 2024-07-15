import { parseConfig, SsrScope } from '@internal/ssr';

import { AppRef } from '../classes/AppRef';
import { Screen } from '../classes/Screen';

// TODO: RenderController, SsrScope, and parseConfig should all come from @internal/ssr
const renderFn = (render, userConfig) => {
  const config = parseConfig(userConfig);
  const scope = new SsrScope(config, AppRef);
  const screen = new Screen(scope);
  scope.container.render(render);
  return screen;
};

export { parseConfig, renderFn as render };
