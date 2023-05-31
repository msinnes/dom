import { SsrScope, parseConfig } from '@internal/ssr';

import { RenderScreenController } from '../classes/RenderScreenController';

const getBootstrappedController = (render, userConfig) => {
  const config = parseConfig(userConfig);
  const ssrScope = new SsrScope(config);
  const controller = new RenderScreenController(render, ssrScope);
  controller.bootstrap();
  return controller;
};

// TODO: this should run and resolve only fetch request that close synchronousely
// It should also log a warning if there are any open handles.
const renderToScreen = (render, userConfig) => {
  const controller = getBootstrappedController(render, userConfig);
  return controller.screen;
};

// TODO: this should run and resolve only fetch request that close synchronousely
// It should also log a warning if there are any open handles.
const renderToString = (render, userConfig) => {
  const controller = getBootstrappedController(render, userConfig);
  return controller.domString;
};

export { renderToScreen, renderToString };
