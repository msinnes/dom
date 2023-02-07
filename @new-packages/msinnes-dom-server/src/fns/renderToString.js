import { SsrScope, parseConfig } from '@internal/ssr';

import { RenderToStringController } from '../classes/RenderToStringController';

const renderToString = (render, userConfig) => {
  const config = parseConfig(userConfig);
  const ssrScope = new SsrScope(config);
  const renderer = new RenderToStringController(render, ssrScope);
  renderer.bootstrap();
  return renderer.domString;
};

export { renderToString };