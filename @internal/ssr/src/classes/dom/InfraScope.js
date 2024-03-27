import * as Dom from '@msinnes/dom';
import { BaseRenderableComponent } from '@internal/base';
import { Infra } from '@internal/infra';

import { Scope } from '../base/Scope';

// Top level rewrite so the individual instances can see the component and contexts, which are both singletons.
Dom.Component = BaseRenderableComponent;
Dom.createContext = defaultValue => Infra.contextService.createEntity(defaultValue);

// Store original api values for instance clearing. All hooks are tied to individual rendering instances.
const useContextOriginal = Dom.useContext;
const useEffectOriginal = Dom.useEffect;
const useMemoOriginal = Dom.useMemo;
const useRefOriginal = Dom.useRef;
const useStateOriginal = Dom.useState;

const createRefOriginal = Dom.createRef;

class InfraScope extends Scope {
  static contextService = this.contextService;

  constructor(infra, AppRef) {
    super();
    this.contextService = infra.contextService;
    this.hooks = infra.hooks;
    this.services = infra.services;
    this.AppRef = AppRef;
  }

  enable() {
    const { useContext, useEffect, useMemo, useState } = this.hooks;
    Dom.useContext = useContext;
    Dom.useEffect = useEffect;
    Dom.useMemo = useMemo;
    Dom.useRef = ref => useMemo(() => Dom.createRef(ref));
    Dom.useState = useState;

    Dom.createRef = ref => new this.AppRef(ref, this);
  }

  disable() {
    Dom.useContext = useContextOriginal;
    Dom.useEffect = useEffectOriginal;
    Dom.useMemo = useMemoOriginal;
    Dom.useRef = useRefOriginal;
    Dom.useState = useStateOriginal;

    Dom.createRef = createRefOriginal;
  }
}

export { InfraScope };
