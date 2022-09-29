import { Effect } from './Effect';

class EffectContext {
  effects = [];

  addEffect(fn, conditions) {
    const effect = new Effect(fn, conditions);
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

export { EffectContext };