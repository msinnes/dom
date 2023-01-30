import { compareDepsArrs } from '../fns/compareDepsArrs';

class Memo {
  tick = 0;

  constructor(fn, dependencies) {
    this.fn = fn;
    this.dependencies = dependencies;
  }

  getValue(nextDependencies) {
    if (this.shouldExecute(nextDependencies)) this.val = this.fn();
    return this.val;
  }

  shouldExecute(nextDependencies) {
    const tick = this.tick++;
    const previousDependencies = this.dependencies;
    this.dependencies = nextDependencies;
    return !tick || compareDepsArrs(previousDependencies, nextDependencies);
  }
}

export { Memo };
