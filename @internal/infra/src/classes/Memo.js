import { BaseDependencyHook } from './base/BaseDependencyHook';

class Memo extends BaseDependencyHook {
  getValue(nextDependencies) {
    if (this.shouldExecute(nextDependencies)) this.val = this.fn();
    return this.val;
  }
}

export { Memo };
