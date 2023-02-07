import { InstanceHooks } from './InstanceHooks';

import { RemovableService } from '../base/RemovableService';

const findActiveOrThrow = activeInstance => {
  if (!activeInstance) throw new Error('InternalError: There is no active context on the controller');
  return activeInstance;
};

const findIdxOrThrow = idx => {
  if (idx < 0) throw new Error('InternalError: The instance was not found');
  return idx;
};

class HookService extends RemovableService {
  activeInstance = null;

  closeActiveInstance() {
    const instance = findActiveOrThrow(this.activeInstance);
    instance.finish();
    this.activeInstance = null;
  }

  createEntity(instance) {
    const hooks = new InstanceHooks(instance);
    this.push(instance, hooks);
  }

  destroyInstance(instance) {
    const idx = findIdxOrThrow(this.findIdx(instance));
    this.removeAt(idx);
  }

  getHook(initialValue) {
    const instance = findActiveOrThrow(this.activeInstance);
    return instance.next(initialValue);
  }

  setActiveInstance(instance) {
    const idx = findIdxOrThrow(this.findIdx(instance));
    this.activeInstance = this.entities[idx];
  }
}

export { HookService };
