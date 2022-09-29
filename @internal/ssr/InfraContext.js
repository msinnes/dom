import * as Dom from '@msinnes/dom';

import { createInfrastructure, contextController } from '@internal/infra';
import { RenderableComponent } from '@internal/app/AppRenderer';

Dom.createContext = defaultValue => contextController.createContext(defaultValue);
Dom.Component = RenderableComponent;

// Store original api values for instance clearing;
const useContextOriginal = Dom.useContext;
const useEffectOriginal = Dom.useEffect;
const useMemoOriginal = Dom.useMemo;
const useStateOriginal = Dom.useState;

class InfraContext {
  constructor() {
    const { hooks, services } = createInfrastructure();
    this.hooks = hooks;
    this.services = services;
  }

  enable() {
    const { useContext, useEffect, useMemo, useState } = this.hooks;
    Dom.useContext = useContext;
    Dom.useEffect = useEffect;
    Dom.useMemo = useMemo;
    Dom.useState = useState;
  }

  disable() {
    Dom.useContext = useContextOriginal;
    Dom.useEffect = useEffectOriginal;
    Dom.useMemo = useMemoOriginal;
    Dom.useState = useStateOriginal;
  }
}

export { InfraContext };