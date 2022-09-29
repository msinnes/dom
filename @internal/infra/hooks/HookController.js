import { BaseDestroyableController } from "../base/BaseDestroyableController";

import { HookContext } from "./HookContext";

const findActiveOrThrow = activeContext => {
  if (!activeContext) throw new Error('InternalError: There is no active context on the controller');
  return activeContext;
};

const findIdxOrThrow = idx => {
  if (idx < 0) throw new Error('InternalError: The instance was not found');
  return idx;
};

class HookController extends BaseDestroyableController {
  activeContext = null;

  closeActiveContext() {
    const ctx = findActiveOrThrow(this.activeContext);
    ctx.finish();
    this.activeContext = null;
  }

  createContext(instance) {
    const context = new HookContext(instance);
    this.push(instance, context);
  }

  destroyContext(instance) {
    const idx = findIdxOrThrow(this.findIdx(instance));
    this.removeAt(idx);
  }

  getHook(initialValue) {
    const ctx = findActiveOrThrow(this.activeContext);
    return ctx.next(initialValue);
  }

  setActiveContext(instance) {
    const idx = findIdxOrThrow(this.findIdx(instance));
    this.activeContext = this.contexts[idx];
  }
}

export { HookController };
