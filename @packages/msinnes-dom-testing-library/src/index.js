import { ShallowRenderController } from './ShallowRenderController';
import { SsrContext } from '@internal/ssr/SsrContext';

const renderFunction = render => {
  const ctx = new SsrContext();
  ctx.enable();
  const ctrl = new ShallowRenderController(render, ctx);
  return ctrl.render();
};

export { renderFunction as render };