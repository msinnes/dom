import { isDefined } from '@internal/is';
import { SsrScope, parseConfig } from '@internal/ssr';

import { AppRef } from '../classes/AppRef';
import { Screen } from '../classes/Screen';

const isDoingFetch = config => isDefined(config.fetch.digestFetch) ? config.fetch.digestFetch : true;

const createScopeAndRender = (render, config) => {
  const ssrScope = new SsrScope(config, AppRef);
  ssrScope.container.render(render);
  return ssrScope;
};

const getScope = (render, userConfig) => {
  const config = parseConfig(userConfig);
  const ssrScope = createScopeAndRender(render, config);
  ssrScope.close();
  if (ssrScope.openHandles > 0 && isDoingFetch(config)) console.warn('Open Handles Detected -- Open handles are ignored after a render is closed');
  return ssrScope;
};

const getScopeAsync = (render, userConfig) => {
  const config = parseConfig(userConfig);
  const ssrScope = createScopeAndRender(render, config);

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject('Timeout Exceeded to resolve promise.');
    }, 2000);

    const after = () => {
      if (ssrScope.openHandles > 0 && isDoingFetch(config)) return;

      resolve(ssrScope);
      clearTimeout(timeoutId);
    };

    ssrScope.hook('fetchResolve', after);
    after();
  });
};

const renderToString = (render, userConfig) => {
  const ssrScope = getScope(render, userConfig);
  return ssrScope.container.elem.innerHTML;
};

const renderToScreen = (render, userConfig) => {
  const ssrScope = getScope(render, userConfig);
  return new Screen(ssrScope);
};

const renderToStringAsync = (render, userConfig) => {
  return getScopeAsync(render, userConfig).then(scope => scope.container.elem.innerHTML);
};

const renderToScreenAsync = (render, userConfig) => {
  return getScopeAsync(render, userConfig).then(scope => new Screen(scope));
};

export { renderToString, renderToScreen, renderToStringAsync, renderToScreenAsync };
