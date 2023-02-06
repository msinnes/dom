import { createHooks } from '../fns/createHooks';
import { createServices } from '../fns/createServices';

import { ContextService } from './ctx/ContextService';
import { EffectService } from './effect/EffectService';
import { HookService } from './hooks/HookService';

const contextService = new ContextService();

class Infra {
  static contextService = contextService;

  effectService = new EffectService();
  hookService = new HookService();

  constructor() {
    this.contextService = contextService;
    this.hooks = createHooks(this.hookService, this.effectService, this.contextService);
    this.services = createServices(this.hookService, this.effectService, this.contextService);
  }
}

export { Infra };
