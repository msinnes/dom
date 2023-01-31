import { BaseDependable } from './base/BaseDependable';

class Memo extends BaseDependable {
  getValue(nextDependencies) {
    if (this.shouldExecute(nextDependencies)) this.val = this.fn();
    return this.val;
  }
}

export { Memo };
