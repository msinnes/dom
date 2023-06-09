import { isDefined } from '@internal/is';
import { SsrScope, parseConfig } from '@internal/ssr';

import { RenderScreenController } from '../classes/RenderScreenController';

const isDoingFetch = config => isDefined(config.fetch.digestFetch) ? config.fetch.digestFetch : true;

const getBootStrappedController = (render, userConfig) => {
  const config = parseConfig(userConfig);
  const ssrScope = new SsrScope(config);
  const controller = new RenderScreenController(render, ssrScope);
  controller.bootstrap();
  return [controller, config];
};

const getSyncController = (render, userConfig) => {
  const [controller, config] = getBootStrappedController(render, userConfig);
  controller.close();
  if (controller.scope.openHandles > 0 && isDoingFetch(config)) console.warn('Open Handles Detected -- Open handles are ignored after a render is closed');
  return controller;
};

const getRenderPromise = (render, userConfig) => {
  const [controller, config] = getBootStrappedController(render, userConfig);

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject('Timeout Exceeded to resolve promise.');
    }, 2000);

    const after = () => {
      if (controller.scope.openHandles > 0 && isDoingFetch(config)) return;

      resolve(controller);
      clearTimeout(timeoutId);
    };

    controller.hook(after);
    after();
  });
};

const renderToScreen = (render, userConfig) => {
  const controller = getSyncController(render, userConfig);
  return controller.screen;
};

const renderToString = (render, userConfig) => {
  const controller = getSyncController(render, userConfig);
  return controller.domString;
};

const renderToScreenAsync = (render, userConfig) => {
  return getRenderPromise(render, userConfig).then(controller => controller.screen);
};

const renderToStringAsync = (render, userConfig) => {
  return getRenderPromise(render, userConfig).then(controller => controller.domString);
};

export { renderToScreen, renderToString, renderToScreenAsync, renderToStringAsync };
