import { SsrScope, parseConfig } from '@internal/ssr';

import { RenderScreenController } from '../classes/RenderScreenController';

const getBootstrappedController = (render, userConfig) => {
  const config = parseConfig(userConfig);
  const ssrScope = new SsrScope(config);
  const controller = new RenderScreenController(render, ssrScope);
  controller.bootstrap();
  return controller;
};

const renderToScreen = (render, userConfig) => {
  const controller = getBootstrappedController(render, userConfig);
  return controller.screen;
};

const renderToString = (render, userConfig) => {
  const controller = getBootstrappedController(render, userConfig);
  return controller.domString;
};

export { renderToScreen, renderToString };
