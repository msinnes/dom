import { isEmpty, isString } from '@internal/is/string';
import { isUndefined } from '@internal/is/undefined';
import { isNull } from '@internal/is/null';

import { DomBootstrapController } from './DomBootstrapController';
import { DomHydrateController } from './DomHydrateController';

const cantRender = render => isUndefined(render) || isNull(render) || (isString(render) && isEmpty(render));

function renderApp(render, anchor) {
  const renderController = new DomBootstrapController(render, anchor);
  if (cantRender(render)) return;
  else renderController.bootstrap();
}

function hydrateApp(render, anchor) {
  const renderController = new DomHydrateController(render, anchor);
  if (cantRender(render)) renderController.emptyElementChildren(anchor);
  else renderController.hydrate();
}

export { renderApp, hydrateApp };
