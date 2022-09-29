const isString = str => typeof str === 'string';

const isEmpty = str => !str.trim().length;

export { isString, isEmpty };