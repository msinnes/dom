import { RemovableService } from '../base/RemovableService';

import { InstanceEffects } from './InstanceEffects';

class ClassEffect {
  constructor(fn) {
    this.fn = fn;
  }

  exec() {
    this.fn();
  }
}

class EffectService extends RemovableService {
  classEffects = [];
  destroyedInstances = [];

  addClassEffect(fn) {
    this.classEffects.push(new ClassEffect(fn));
  }

  addEffect(instance, fn, dependencies) {
    const instanceEffects = this.lookup(instance);
    return instanceEffects.addEffect(fn, dependencies);
  }

  createEntity(instance) {
    const instanceEffects = new InstanceEffects();
    this.push(instance, instanceEffects);
  }

  destroyInstance(instance) {
    const idx = this.indexes.indexOf(instance);
    const instanceEffects = this.entities[idx];
    this.removeAt(idx);
    this.destroyedInstances.push(instanceEffects);
  }

  digest() {
    this.entities.forEach(instanceEffects => instanceEffects.executeEffects());
    this.destroyedInstances.forEach(instanceEffects => instanceEffects.cleanupEffects());
    this.classEffects.forEach(effect => effect.exec());
    this.destroyedInstances = [];
    this.classEffects = [];
  }
}

export { EffectService };
