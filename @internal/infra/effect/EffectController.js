import { BaseDestroyableController } from '../base/BaseDestroyableController';

import { EffectContext } from './EffectContext';

class EffectController extends BaseDestroyableController {
  destroyedContexts = [];

  addEffect(instance, fn, conditions) {
    const ctx = this.lookup(instance);
    return ctx.addEffect(fn, conditions);
  }

  createContext(instance) {
    const ctx = new EffectContext();
    this.push(instance, ctx);
  }

  destroyContext(instance) {
    const idx = this.instances.indexOf(instance);
    const ctx = this.contexts[idx];
    this.removeAt(idx);
    this.destroyedContexts.push(ctx);
  }

  digest() {
    this.contexts.forEach(ctx => ctx.executeEffects());
    this.destroyedContexts.forEach(ctx => ctx.cleanupEffects());
    this.destroyedContexts = [];
  }
}

export { EffectController };