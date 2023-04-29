import * as Dom from '@msinnes/dom';
import { BaseRenderableComponent } from '@internal/base';
import { Infra } from '@internal/infra';


// Top level rewrite so the individual instances can see the component and contexts, which are both singletons.
Dom.Component = BaseRenderableComponent;
Dom.createContext = defaultValue => Infra.contextService.createEntity(defaultValue);

// Store original api values for instance clearing. All hooks are tied to individual rendering instances.
const useContextOriginal = Dom.useContext;
const useEffectOriginal = Dom.useEffect;
const useMemoOriginal = Dom.useMemo;
const useStateOriginal = Dom.useState;

class InfraScope {
  static contextService = this.contextService;

  constructor(infra) {
    this.contextService = infra.contextService;
    this.hooks = infra.hooks;
    this.services = infra.services;
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

export { InfraScope };
