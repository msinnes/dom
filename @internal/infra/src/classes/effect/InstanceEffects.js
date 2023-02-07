import { Effect } from './Effect';

class InstanceEffects {
  effects = [];

  addEffect(fn, dependencies) {
    const effect = new Effect(fn, dependencies);
    this.effects.push(effect);
    return effect;
  }

  each(fn) {
    this.effects.forEach(fn);
  }

  executeEffects() {
    this.each(effect => effect.exec());
  }

  cleanupEffects() {
    this.each(effect => effect.cleanup());
  }
}

export { InstanceEffects };
