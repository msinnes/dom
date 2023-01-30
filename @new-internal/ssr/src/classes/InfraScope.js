import * as Dom from '@new-msinnes/dom';

import { BaseRenderableComponent } from '@new-internal/base';

Dom.Component = BaseRenderableComponent;

// Store original api values for instance clearing;
const useMemoOriginal = Dom.useMemo;
const useStateOriginal = Dom.useState;

class InfraScope {
  constructor(infra) {
    this.hooks = infra.hooks;
    this.services = infra.services;
  }

  enable() {
    const { useMemo, useState } = this.hooks;
    Dom.useMemo = useMemo;
    Dom.useState = useState;
  }

  disable() {
    Dom.useMemo = useMemoOriginal;
    Dom.useState = useStateOriginal;
  }
}

export { InfraScope };
