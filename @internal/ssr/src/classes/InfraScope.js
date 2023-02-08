import * as Dom from '@msinnes/dom';

// Store original api values for instance clearing;
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
