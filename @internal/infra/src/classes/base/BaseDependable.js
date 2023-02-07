import { abstract } from '@internal/oop';

const compareDepsArrs = (dependencies, nextDependencies) => {
  if (nextDependencies && nextDependencies.length === 0) return false;
  const checkedDependencies = dependencies || [];
  const checkedNextDependencies = nextDependencies || [];
  if (checkedDependencies.length !== checkedNextDependencies.length) return true;
  return checkedDependencies.reduce((acc, item, i) => {
    let curr = acc;
    if (item !== checkedNextDependencies[i]) curr = true;
    return curr;
  }, false);
};

const BaseDependable = abstract(class {
  tick = 0;

  constructor(fn, dependencies) {
    this.fn = fn;
    this.dependencies = dependencies;
  }

  shouldExecute(nextDependencies) {
    const tick = this.tick++;
    const previousDependencies = this.dependencies;
    this.dependencies = nextDependencies;
    return !tick || compareDepsArrs(previousDependencies, nextDependencies);
  }
});

export { BaseDependable };
