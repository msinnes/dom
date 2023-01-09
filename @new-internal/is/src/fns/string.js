const isString = str => typeof str === 'string';

const isEmptyString = str => !str.trim().length;

export { isString, isEmptyString };