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

export { compareDepsArrs };
