import { BaseDependable } from '../base/BaseDependable';

class Effect extends BaseDependable {
  cleanupFn = null;
  nextDependencies = [];

  cleanup() {
    this.cleanupFn && this.cleanupFn();
  }

  exec() {
    if (this.shouldExecute(this.nextDependencies) || !this.dependencies) this.cleanupFn = this.fn();
    this.dependencies = this.nextDependencies;
  }
}

export { Effect };
