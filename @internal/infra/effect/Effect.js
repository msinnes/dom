import compareDepsArrs from "@internal/utils/compareDepsArrs";

class Effect {
  cleanupFn = null;
  shouldExecute = true;
  needsFirstExecution = true;

  constructor(fn, conditions) {
    this.fn = fn;
    this.lastConditions = conditions;
  }

  cleanup() {
    this.cleanupFn && this.cleanupFn();
  }

  exec() {
    if (this.shouldExecute)
      this.cleanupFn = this.fn();

    this.needsFirstExecution = false;
  }

  setShouldExecute(nextConditions) {
    this.shouldExecute = this.needsFirstExecution || compareDepsArrs(this.lastConditions, nextConditions);
    this.lastConditions = nextConditions;
  }
}

export { Effect };
