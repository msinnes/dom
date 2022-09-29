import { SsrContext } from '@internal/ssr/SsrContext';

import { ToStringRenderController } from './ToStringRenderController';

function renderToString(render) {
  const ssrContext = new SsrContext();
  ssrContext.enable();
  const renderer = new ToStringRenderController(render, ssrContext);
  ssrContext.disable();
  return renderer.render();;
}

export { renderToString };