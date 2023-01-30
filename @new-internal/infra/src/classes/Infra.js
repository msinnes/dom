import { createHooks } from '../fns/createHooks';
import { createServices } from '../fns/createServices';

import { HookService } from './hooks/HookService';

class Infra {
  hookService = new HookService();

  constructor() {
    this.hooks = createHooks(this.hookService);
    this.services = createServices(this.hookService);
  }
}

export { Infra };
