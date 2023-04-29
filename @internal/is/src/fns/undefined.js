const isUndefined = c => typeof c === 'undefined';
const isDefined = c => (!isUndefined(c));

export { isUndefined, isDefined };
