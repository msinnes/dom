export default function compareDepsArrs(conditions, nextConditions) {
  if (nextConditions && nextConditions.length === 0) return false;
  const checkedConditions = conditions || [];
  const checkedNextConditions = nextConditions || [];
  if (checkedConditions.length !== checkedNextConditions.length) return true;
  return checkedConditions.reduce((acc, item, i) => {
    let curr = acc;
    if (item !== checkedNextConditions[i]) curr = true;
    return curr;
  }, false);
}